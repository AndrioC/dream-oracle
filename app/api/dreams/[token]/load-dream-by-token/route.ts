import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';
import { decrypt } from '@/utils/crypto';

export async function GET(
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

  const dream = await prisma.dream.findUnique({
    where: {
      id: Number(decrypt(encryptedId)),
      userId: Number(session.user?.id),
    },
  });

  if (!dream) {
    return NextResponse.json(
      { error: 'Sonho não encontrado' },
      { status: 404 }
    );
  }

  return NextResponse.json(dream);
}
