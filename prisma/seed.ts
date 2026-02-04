import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const wilayas = [
  { code: '01', name: 'Adrar', nameAr: 'أدرار', shippingCost: 500, isAlger: false },
  { code: '02', name: 'Chlef', nameAr: 'الشلف', shippingCost: 500, isAlger: false },
  { code: '03', name: 'Laghouat', nameAr: 'الأغواط', shippingCost: 500, isAlger: false },
  { code: '04', name: 'Oum El Bouaghi', nameAr: 'أم البواقي', shippingCost: 500, isAlger: false },
  { code: '05', name: 'Batna', nameAr: 'باتنة', shippingCost: 500, isAlger: false },
  { code: '06', name: 'Béjaïa', nameAr: 'بجاية', shippingCost: 500, isAlger: false },
  { code: '07', name: 'Biskra', nameAr: 'بسكرة', shippingCost: 500, isAlger: false },
  { code: '08', name: 'Béchar', nameAr: 'بشار', shippingCost: 500, isAlger: false },
  { code: '09', name: 'Blida', nameAr: 'البليدة', shippingCost: 500, isAlger: false },
  { code: '10', name: 'Bouira', nameAr: 'البويرة', shippingCost: 500, isAlger: false },
  { code: '11', name: 'Tamanrasset', nameAr: 'تمنراست', shippingCost: 500, isAlger: false },
  { code: '12', name: 'Tébessa', nameAr: 'تبسة', shippingCost: 500, isAlger: false },
  { code: '13', name: 'Tlemcen', nameAr: 'تلمسان', shippingCost: 500, isAlger: false },
  { code: '14', name: 'Tiaret', nameAr: 'تيارت', shippingCost: 500, isAlger: false },
  { code: '15', name: 'Tizi Ouzou', nameAr: 'تيزي وزو', shippingCost: 500, isAlger: false },
  { code: '16', name: 'Alger', nameAr: 'الجزائر', shippingCost: 500, isAlger: true },
  { code: '17', name: 'Djelfa', nameAr: 'الجلفة', shippingCost: 500, isAlger: false },
  { code: '18', name: 'Jijel', nameAr: 'جيجل', shippingCost: 500, isAlger: false },
  { code: '19', name: 'Sétif', nameAr: 'سطيف', shippingCost: 500, isAlger: false },
  { code: '20', name: 'Saïda', nameAr: 'سعيدة', shippingCost: 500, isAlger: false },
  { code: '21', name: 'Skikda', nameAr: 'سكيكدة', shippingCost: 500, isAlger: false },
  { code: '22', name: 'Sidi Bel Abbès', nameAr: 'سيدي بلعباس', shippingCost: 500, isAlger: false },
  { code: '23', name: 'Annaba', nameAr: 'عنابة', shippingCost: 500, isAlger: false },
  { code: '24', name: 'Guelma', nameAr: 'قالمة', shippingCost: 500, isAlger: false },
  { code: '25', name: 'Constantine', nameAr: 'قسنطينة', shippingCost: 500, isAlger: false },
  { code: '26', name: 'Médéa', nameAr: 'المدية', shippingCost: 500, isAlger: false },
  { code: '27', name: 'Mostaganem', nameAr: 'مستغانم', shippingCost: 500, isAlger: false },
  { code: '28', name: "M'Sila", nameAr: 'المسيلة', shippingCost: 500, isAlger: false },
  { code: '29', name: 'Mascara', nameAr: 'معسكر', shippingCost: 500, isAlger: false },
  { code: '30', name: 'Ouargla', nameAr: 'ورقلة', shippingCost: 500, isAlger: false },
  { code: '31', name: 'Oran', nameAr: 'وهران', shippingCost: 500, isAlger: false },
  { code: '32', name: 'El Bayadh', nameAr: 'البيض', shippingCost: 500, isAlger: false },
  { code: '33', name: 'Illizi', nameAr: 'إليزي', shippingCost: 500, isAlger: false },
  { code: '34', name: 'Bordj Bou Arreridj', nameAr: 'برج بوعريريج', shippingCost: 500, isAlger: false },
  { code: '35', name: 'Boumerdès', nameAr: 'بومرداس', shippingCost: 500, isAlger: false },
  { code: '36', name: 'El Tarf', nameAr: 'الطارف', shippingCost: 500, isAlger: false },
  { code: '37', name: 'Tindouf', nameAr: 'تندوف', shippingCost: 500, isAlger: false },
  { code: '38', name: 'Tissemsilt', nameAr: 'تيسمسيلت', shippingCost: 500, isAlger: false },
  { code: '39', name: 'El Oued', nameAr: 'الوادي', shippingCost: 500, isAlger: false },
  { code: '40', name: 'Khenchela', nameAr: 'خنشلة', shippingCost: 500, isAlger: false },
  { code: '41', name: 'Souk Ahras', nameAr: 'سوق أهراس', shippingCost: 500, isAlger: false },
  { code: '42', name: 'Tipaza', nameAr: 'تيبازة', shippingCost: 500, isAlger: false },
  { code: '43', name: 'Mila', nameAr: 'ميلة', shippingCost: 500, isAlger: false },
  { code: '44', name: 'Aïn Defla', nameAr: 'عين الدفلى', shippingCost: 500, isAlger: false },
  { code: '45', name: 'Naâma', nameAr: 'النعامة', shippingCost: 500, isAlger: false },
  { code: '46', name: 'Aïn Témouchent', nameAr: 'عين تموشنت', shippingCost: 500, isAlger: false },
  { code: '47', name: 'Ghardaïa', nameAr: 'غرداية', shippingCost: 500, isAlger: false },
  { code: '48', name: 'Relizane', nameAr: 'غليزان', shippingCost: 500, isAlger: false },
  { code: '49', name: 'Timimoun', nameAr: 'تيميمون', shippingCost: 500, isAlger: false },
  { code: '50', name: 'Bordj Badji Mokhtar', nameAr: 'برج باجي مختار', shippingCost: 500, isAlger: false },
  { code: '51', name: 'Ouled Djellal', nameAr: 'أولاد جلال', shippingCost: 500, isAlger: false },
  { code: '52', name: 'Béni Abbès', nameAr: 'بني عباس', shippingCost: 500, isAlger: false },
  { code: '53', name: 'In Salah', nameAr: 'عين صالح', shippingCost: 500, isAlger: false },
  { code: '54', name: 'In Guezzam', nameAr: 'عين قزام', shippingCost: 500, isAlger: false },
  { code: '55', name: 'Touggourt', nameAr: 'تقرت', shippingCost: 500, isAlger: false },
  { code: '56', name: 'Djanet', nameAr: 'جانت', shippingCost: 500, isAlger: false },
  { code: '57', name: "El M'Ghair", nameAr: 'المغير', shippingCost: 500, isAlger: false },
  { code: '58', name: 'El Meniaa', nameAr: 'المنيعة', shippingCost: 500, isAlger: false },
];

const categories = [
  {
    name: 'Protéines',
    slug: 'proteines',
    description: 'Protéines de haute qualité pour la prise de masse musculaire',
    order: 1,
  },
  {
    name: 'Gainers',
    slug: 'gainers',
    description: 'Gainers pour la prise de poids et de masse',
    order: 2,
  },
  {
    name: 'Créatine',
    slug: 'creatine',
    description: 'Créatine pour améliorer la performance et la force',
    order: 3,
  },
  {
    name: 'Pré-Workout',
    slug: 'pre-workout',
    description: 'Boosters d\'énergie pour vos entraînements',
    order: 4,
  },
  {
    name: 'Vitamines',
    slug: 'vitamines',
    description: 'Compléments vitaminés pour la santé générale',
    order: 5,
  },
];

async function main() {
  console.log('Seeding database...');

  // Seed wilayas
  console.log('Seeding wilayas...');
  for (const wilaya of wilayas) {
    await prisma.wilaya.upsert({
      where: { code: wilaya.code },
      update: wilaya,
      create: wilaya,
    });
  }
  console.log(`Seeded ${wilayas.length} wilayas`);

  // Seed categories
  console.log('Seeding categories...');
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }
  console.log(`Seeded ${categories.length} categories`);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
