const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID_ALGER = process.env.TELEGRAM_CHAT_ID_ALGER || '';
const TELEGRAM_CHAT_ID_HORS_WILAYA = process.env.TELEGRAM_CHAT_ID_HORS_WILAYA || '';

export async function sendTelegramNotification(order: any) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.warn('Telegram not configured');
    return;
  }

  try {
    // Déterminer si c'est Alger ou hors wilaya
    const isAlger = order.wilaya?.code === '16' || order.wilayaId === '16';
    const chatId = isAlger ? TELEGRAM_CHAT_ID_ALGER : TELEGRAM_CHAT_ID_HORS_WILAYA;

    if (!chatId) {
      console.warn(`Telegram chat ID not configured for ${isAlger ? 'Alger' : 'hors wilaya'}`);
      return;
    }

    const items = order.items
      .map(
        (item: any) =>
          `• ${item.quantity}x ${item.product?.name || 'Produit'} — ${item.total.toLocaleString('fr-FR')} DA`
      )
      .join('\n');

    const wilayaName = order.wilaya?.name || 'N/A';
    const date = new Date(order.createdAt).toLocaleString('fr-FR', {
      timeZone: 'Africa/Algiers',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const zone = isAlger ? '📍 ALGER' : '📍 HORS WILAYA';

    const message = `🛒 *NOUVELLE COMMANDE* #${order.orderNumber}
${zone}

👤 ${order.guestFirstName} ${order.guestLastName}
📞 ${order.guestPhone}
📍 ${wilayaName}${order.commune ? ` - ${order.commune}` : ''}

📦 *Produits :*
${items}

💰 Sous-total : ${order.subtotal.toLocaleString('fr-FR')} DA
💵 *Total : ${order.total.toLocaleString('fr-FR')} DA*

💳 Paiement : ${order.paymentMethod === 'CASH_ON_DELIVERY' ? 'À la livraison' : order.paymentMethod}
📸 Reçu : ${order.paymentReceipt ? 'Oui ✅' : 'Non'}

⏰ ${date}`;

    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    // Si hors wilaya et il y a un reçu, envoyer la photo du reçu
    if (!isAlger && order.paymentReceipt && order.paymentReceipt.startsWith('data:image')) {
      try {
        // Convertir base64 en buffer
        const base64Data = order.paymentReceipt.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('caption', `📸 Reçu commande #${order.orderNumber}`);
        formData.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'recu.jpg');

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
          {
            method: 'POST',
            body: formData,
          }
        );
      } catch (photoError) {
        console.error('Telegram photo error:', photoError);
      }
    }

    // Message séparateur
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: '➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖',
        }),
      }
    );
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}