import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { commentId } = await request.json();

  try {
    const comment = await prisma.dreamComment.findUnique({
      where: { id: commentId },
      include: { dream: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    if (
      comment.userId !== Number(session.user.id) &&
      comment.dream.userId !== Number(session.user.id)
    ) {
      return NextResponse.json(
        { error: 'Não autorizado a remover este comentário' },
        { status: 403 }
      );
    }

    await prisma.dreamComment.delete({
      where: { id: commentId },
    });

    return NextResponse.json(
      { message: 'Comentário removido com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao remover comentário', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao remover comentário',
      },
      { status: 500 }
    );
  }
}
