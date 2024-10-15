import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function PUT(
  request: Request,
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

  const { title, description, date, isPublic } = await request.json();

  const updatedDream = await prisma.dream.update({
    where: { id: Number(encryptedId), userId: Number(session.user.id) },
    data: { title, description, date: new Date(date), isPublic },
  });

  return NextResponse.json(updatedDream);
}
