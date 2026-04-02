import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create default site configuration
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      contactButtonUrl: 'mailto:marius.bc@ik.me',
    },
  });

  console.log('⚙️ Created site config:', siteConfig.contactButtonUrl);

  // Create default dock icons
  const dockIcons = [
    {
      id: 'github-icon',
      name: 'GitHub',
      iconName: 'Github',
      url: 'https://github.com/ItsMariusBC',
      tooltip: 'GitHub',
      order: 1,
    },
    {
      id: 'linkedin-icon',
      name: 'LinkedIn',
      iconName: 'Linkedin',
      url: 'https://www.linkedin.com/in/marius-biziere-couzinet-1054822b4/',
      tooltip: 'LinkedIn',
      order: 2,
    },
    {
      id: 'discord-icon',
      name: 'Discord',
      iconName: 'MessageSquare',
      url: 'https://discord.gg/33wkRvG6dC',
      tooltip: 'Discord',
      order: 3,
    },
    {
      id: 'cv-icon',
      name: 'CV',
      iconName: 'FileText',
      url: 'https://cv.sheldon-dev.fr',
      tooltip: 'CV',
      order: 4,
    },
    {
      id: 'email-icon',
      name: 'Email',
      iconName: 'Mail',
      url: 'mailto:marius.bc@ik.me',
      tooltip: 'Email',
      order: 5,
    },
    {
      id: 'phone-icon',
      name: 'Téléphone',
      iconName: 'Phone',
      url: 'tel:+33752066158',
      tooltip: 'Phone',
      order: 6,
    },
  ];

  for (const icon of dockIcons) {
    await prisma.dockIcon.upsert({
      where: { id: icon.id },
      update: {},
      create: icon,
    });
  }

  console.log('🔗 Created dock icons:', dockIcons.length);
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });