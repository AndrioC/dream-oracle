import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const credit = await prisma.credit.findUnique({
    where: { userId: Number(session.user.id) },
  });

  if (!credit) {
    const newCredit = await prisma.credit.create({
      data: {
        userId: Number(session.user.id),
        amount: 2,
      },
    });
    return NextResponse.json({ credits: newCredit.amount });
  }

  return NextResponse.json({ credits: credit.amount });
}
