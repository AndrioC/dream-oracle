import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const userSettings = await prisma.userSettings.findUnique({
      where: { userId: Number(session.user.id) },
    });

    if (!userSettings) {
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: Number(session.user.id),
          language: 'pt-BR',
          theme: 'system',
        },
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error('Erro ao carregar configurações do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar configurações' },
      { status: 500 }
    );
  }
}
