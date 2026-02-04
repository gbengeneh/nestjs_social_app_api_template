const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const communities = [
    { name: 'Relationship', description: 'Discuss relationships and dating' },
    { name: 'Football', description: 'All about football and matches' },
    { name: 'Work', description: 'Work-related topics and career advice' },
    { name: 'Church', description: 'Faith, church activities, and spirituality' },
    { name: 'Technology', description: 'Latest tech news and discussions' },
    { name: 'Health', description: 'Health tips and wellness' },
    { name: 'Travel', description: 'Travel experiences and tips' },
    { name: 'Food', description: 'Recipes, restaurants, and food talk' },
    { name: 'Movies', description: 'Movie reviews and recommendations' },
    { name: 'Music', description: 'Music genres, artists, and concerts' },
  ];

  for (const community of communities) {
    await prisma.community.create({
      data: community,
    });
  }

  console.log('Seeded communities successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
