import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  const posts = await prisma.post.findMany({
    include: {
      user: true
    }
  });

  const testPosts = posts.filter(p => 
    p.user && p.user.username === 'test_user_swipe'
  );

  console.log(`Found ${testPosts.length} test posts to delete.`);

  for (const post of testPosts) {
    console.log(`Deleting post ID: ${post.id} (collegeTag: ${post.collegeTag})`);
    
    // Cascading deletes
    await prisma.comment.deleteMany({ where: { postId: post.id } });
    await prisma.like.deleteMany({ where: { postId: post.id } });
    await prisma.save.deleteMany({ where: { postId: post.id } });
    
    await prisma.post.delete({
      where: { id: post.id }
    });
    console.log('Successfully deleted!');
  }

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
