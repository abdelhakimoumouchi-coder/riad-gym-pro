cat <<'EOF' > /tmp/dump.txt
--------- prisma/schema.prisma ---------
EOF
cat prisma/schema.prisma >> /tmp/dump.txt

cat <<'EOF' >> /tmp/dump.txt
--------- src/app/api/admin/products/route.ts ---------
EOF
cat src/app/api/admin/products/route.ts >> /tmp/dump.txt

cat <<'EOF' >> /tmp/dump.txt
--------- src/app/api/admin/products/[id]/route.ts ---------
EOF
cat src/app/api/admin/products/[id]/route.ts >> /tmp/dump.txt

cat <<'EOF' >> /tmp/dump.txt
--------- src/app/admin/produits/nouveau/page.tsx ---------
EOF
cat src/app/admin/produits/nouveau/page.tsx >> /tmp/dump.txt

cat <<'EOF' >> /tmp/dump.txt
--------- src/app/admin/produits/[id]/page.tsx ---------
EOF
cat src/app/admin/produits/[id]/page.tsx >> /tmp/dump.txt

cat <<'EOF' >> /tmp/dump.txt
--------- src/types/index.ts ---------
EOF
cat src/types/index.ts >> /tmp/dump.txt

cat <<'EOF' >> /tmp/dump.txt
--------- src/lib/utils.ts ---------
EOF
cat src/lib/utils.ts >> /tmp/dump.txt
