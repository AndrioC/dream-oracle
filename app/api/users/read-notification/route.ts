import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { notificationIds } = await request.json();

  try {
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: Number(session.user.id),
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Erro ao marcar notificações como lidas', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao marcar notificações como lidas',
      },
      { status: 500 }
    );
  }
}
