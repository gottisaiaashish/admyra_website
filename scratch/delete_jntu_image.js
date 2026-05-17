import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../backend/.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('Database URL:', process.env.DATABASE_URL ? 'Loaded successfully!' : 'Not found');
  
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          username: true
        }
      }
    }
  });

  console.log('Total posts in database:', posts.length);
  
  const jntuPosts = posts.filter(p => 
    p.collegeTag && p.collegeTag.toLowerCase().includes('jntu')
  );

  console.log('JNTU/JNTUH Tagged Posts:');
  jntuPosts.forEach(p => {
    console.log({
      id: p.id,
      type: p.type,
      mediaUrl: p.mediaUrl,
      caption: p.caption,
      collegeTag: p.collegeTag,
      userName: p.user?.name,
      userUsername: p.user?.username,
      createdAt: p.createdAt
    });
  });

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
