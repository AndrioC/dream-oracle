import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: Number(session.user.id), read: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        dream: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações', error);
    console.log('ERRROR', error);
    return NextResponse.json(
      { error: 'Falha ao buscar notificações' },
      { status: 500 }
    );
  }
}
