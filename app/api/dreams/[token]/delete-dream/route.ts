import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function DELETE(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!params.token) {
    return NextResponse.json({ error: 'Token ausente' }, { status: 400 });
  }

  const encryptedId = params.token as string;

  await prisma.dream.delete({
    where: { id: Number(encryptedId), userId: Number(session.user.id) },
  });

  return NextResponse.json({ message: 'Sonho deletado com sucesso' });
}
