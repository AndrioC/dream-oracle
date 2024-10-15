import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { dreamId, content } = await request.json();

  if (!content || content.trim() === '') {
    return NextResponse.json(
      { error: 'O comentário não pode estar vazio' },
      { status: 400 }
    );
  }

  try {
    const dream = await prisma.dream.findUnique({
      where: { id: dreamId },
    });

    if (!dream) {
      return NextResponse.json(
        { error: 'Sonho não encontrado' },
        { status: 404 }
      );
    }

    const comment = await prisma.dreamComment.create({
      data: {
        dreamId: dreamId,
        userId: Number(session.user.id),
        content: content.trim(),
      },
    });

    if (dream.userId !== Number(session.user.id)) {
      await prisma.notification.create({
        data: {
          type: 'COMMENT',
          dreamId: dreamId,
          userId: dream.userId,
        },
      });
    }

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar comentário', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Falha ao criar comentário',
      },
      { status: 500 }
    );
  }
}
