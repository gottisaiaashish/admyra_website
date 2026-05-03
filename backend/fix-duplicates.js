import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database and setting specific username...');

  // 1. Set specific username for teamadmyra@gmail.com
  const specificUser = await prisma.user.findUnique({
    where: { email: 'teamadmyra@gmail.com' }
  });

  if (specificUser) {
    console.log(`Setting username 'nani' for teamadmyra@gmail.com...`);
    await prisma.user.update({
      where: { email: 'teamadmyra@gmail.com' },
      data: { username: 'nani' }
    });
  } else {
    console.log('User teamadmyra@gmail.com not found.');
  }

  // 2. Fix remaining duplicates
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true }
  });

  const usernameMap = new Map();
  const duplicates = [];

  for (const user of users) {
    if (user.username) {
      if (usernameMap.has(user.username)) {
        duplicates.push(user);
      } else {
        usernameMap.set(user.username, user.id);
      }
    }
  }

  if (duplicates.length === 0) {
    console.log('No other duplicate usernames found.');
  } else {
    console.log(`Found ${duplicates.length} other duplicate usernames. Fixing...`);
    for (const user of duplicates) {
      // Don't touch the one we just set to 'nani'
      if (user.email === 'teamadmyra@gmail.com') continue;

      const newUsername = `${user.username}${Math.floor(Math.random() * 9000) + 1000}`;
      console.log(`Updating user ${user.email}: ${user.username} -> ${newUsername}`);
      
      await prisma.user.update({
        where: { id: user.id },
        data: { username: newUsername }
      });
    }
  }

  console.log('Cleanup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
