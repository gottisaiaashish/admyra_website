import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const email = 'gottisaiaashish@gmail.com';
  const newPassword = 'Admyra@123';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword }
    });
    console.log('Password reset successfully for:', user.email);
  } catch (error) {
    console.error('Error resetting password:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
