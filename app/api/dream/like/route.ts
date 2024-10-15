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
    const result = await prisma.$transaction(async (tx) => {
      const dream = await tx.dream.findUnique({
        where: { id: dreamId },
        include: { user: true },
      });

      if (!dream) {
        throw new Error('Sonho não encontrado');
      }

      const existingLike = await tx.dreamLike.findUnique({
        where: {
          dreamId_userId: {
            dreamId: dreamId,
            userId: Number(session.user?.id),
          },
        },
      });

      if (existingLike) {
        await tx.dreamLike.delete({
          where: { id: existingLike.id },
        });

        await tx.notification.deleteMany({
          where: {
            type: 'LIKE',
            dreamId: dreamId,
            userId: dream.userId,
          },
        });

        return { liked: false };
      } else {
        await tx.dreamLike.create({
          data: {
            dreamId: dreamId,
            userId: Number(session.user?.id),
          },
        });

        //TESTE
        await tx.notification.create({
          data: {
            type: 'LIKE',
            dreamId: dreamId,
            userId: dream.userId,
          },
        });

        if (dream.userId !== Number(session.user?.id)) {
          await tx.notification.create({
            data: {
              type: 'LIKE',
              dreamId: dreamId,
              userId: dream.userId,
            },
          });
        }

        return { liked: true };
      }
    });

    return NextResponse.json(result, { status: result.liked ? 201 : 200 });
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
