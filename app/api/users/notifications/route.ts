import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { dreamId } = await request.json();

  try {
    const dream = await prisma.dream.findUnique({
      where: { id: dreamId },
      include: { user: true },
    });

    if (!dream) {
      return NextResponse.json(
        { error: 'Sonho não encontrado' },
        { status: 404 }
      );
    }

    const existingLike = await prisma.dreamLike.findUnique({
      where: {
        dreamId_userId: {
          dreamId: dreamId,
          userId: Number(session.user.id),
        },
      },
    });

    if (existingLike) {
      await prisma.dreamLike.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ liked: false }, { status: 200 });
    } else {
      await prisma.dreamLike.create({
        data: {
          dreamId: dreamId,
          userId: Number(session.user.id),
        },
      });

      if (dream.userId !== Number(session.user.id)) {
        await prisma.notification.create({
          data: {
            type: 'LIKE',
            dreamId: dreamId,
            userId: dream.userId,
          },
          include: {
            dream: {
              select: {
                title: true,
              },
            },
          },
        });
      }

      return NextResponse.json({ liked: true }, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao processar like', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Falha ao processar like',
      },
      { status: 500 }
    );
  }
}
