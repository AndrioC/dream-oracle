import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function PUT(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { commentId, content } = await request.json();

  if (!content || content.trim() === '') {
    return NextResponse.json(
      { error: 'O comentário não pode estar vazio' },
      { status: 400 }
    );
  }

  try {
    const comment = await prisma.dreamComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comentário não encontrado' },
        { status: 404 }
      );
    }

    if (comment.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: 'Não autorizado a editar este comentário' },
        { status: 403 }
      );
    }

    const updatedComment = await prisma.dreamComment.update({
      where: { id: commentId },
      data: { content: content.trim() },
    });

    return NextResponse.json({ comment: updatedComment }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar comentário', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao atualizar comentário',
      },
      { status: 500 }
    );
  }
}
