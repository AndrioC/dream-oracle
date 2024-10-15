import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { language, theme } = await request.json();

    if (!language || !theme) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const updatedSettings = await prisma.userSettings.upsert({
      where: { userId: Number(session.user.id) },
      update: { language, theme },
      create: {
        userId: Number(session.user.id),
        language,
        theme,
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Erro ao atualizar configurações do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações' },
      { status: 500 }
    );
  }
}
