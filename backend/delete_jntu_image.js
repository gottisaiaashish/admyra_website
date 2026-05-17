import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('Connecting to database...');
  const posts = await prisma.post.findMany({
    where: {
      collegeTag: {
        contains: 'JNTU',
        mode: 'insensitive'
      }
    },
    include: {
      user: true
    }
  });

  const list = posts.map(post => ({
    id: post.id,
    type: post.type,
    mediaUrlStart: post.mediaUrl ? post.mediaUrl.substring(0, 50) : '',
    mediaUrlLength: post.mediaUrl ? post.mediaUrl.length : 0,
    caption: post.caption,
    username: post.user?.username
  }));

  fs.writeFileSync(path.resolve(__dirname, '../scratch/jntu_posts_clean.json'), JSON.stringify(list, null, 2), 'utf8');
  console.log(`Successfully saved ${posts.length} JNTU posts to scratch/jntu_posts_clean.json!`);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  prisma.$disconnect();
});
