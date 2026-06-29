const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error('SEED_ADMIN_EMAIL and a SEED_ADMIN_PASSWORD of at least 12 characters are required');
  }
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      full_name: 'Ayham Sweid',
      role: UserRole.ADMIN,
      is_active: true,
      password_hash: passwordHash
    },
    create: {
      full_name: 'Ayham Sweid',
      email,
      role: UserRole.ADMIN,
      is_active: true,
      password_hash: passwordHash
    }
  });

  console.log('Seeded admin user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
