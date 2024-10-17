import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/prisma/client';
import { generateDreamImage, interpretDream } from '@/lib/openai';

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const {
    title,
    description,
    date,
    isPublic,
    interpretDream: shouldInterpret,
    generateImage,
    imageType,
  } = await request.json();

  const utcDate = new Date(date);
  utcDate.setUTCHours(3, 0, 0, 0);

  try {
    const requiredCredits = (shouldInterpret ? 1 : 0) + (generateImage ? 1 : 0);
    const credit = await prisma.credit.findUnique({
      where: { userId: Number(session.user.id) },
    });

    if (!credit || credit.amount < requiredCredits) {
      return NextResponse.json(
        { error: 'Créditos insuficientes' },
        { status: 403 }
      );
    }

    const dream = await prisma.dream.create({
      data: {
        title,
        description,
        date: utcDate,
        isPublic,
        userId: Number(session.user?.id),
        imageStyle: generateImage ? imageType : null,
      },
    });

    let creditsUsed = 0;
    let interpretation = null;
    let imageUrl = null;

    if (shouldInterpret) {
      try {
        interpretation = await interpretDream(description);
        await prisma.dream.update({
          where: { id: dream.id },
          data: { interpretation },
        });
        creditsUsed++;
      } catch (error) {
        console.error('Erro ao interpretar o sonho:', error);
      }
    }

    if (generateImage) {
      try {
        console.log('DESCRIPTION', description, 'IMAGE_TYPE', imageType);
        imageUrl = await generateDreamImage(description, imageType);
        if (imageUrl) {
          await prisma.dream.update({
            where: { id: dream.id },
            data: { imageUrl },
          });
          creditsUsed++;
        } else {
          console.error('URL da imagem não foi gerada');
        }
      } catch (error) {
        console.error('Erro ao gerar ou fazer upload da imagem:', error);
      }
    }

    if (creditsUsed > 0) {
      await prisma.credit.update({
        where: { userId: Number(session.user?.id) },
        data: { amount: { decrement: creditsUsed } },
      });
    }

    const updatedDream = await prisma.dream.findUnique({
      where: { id: dream.id },
    });

    return NextResponse.json(
      {
        dream: updatedDream,
        creditsUsed,
        interpretation: interpretation ? true : false,
        imageGenerated: imageUrl ? true : false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar o sonho', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Falha ao criar o sonho',
      },
      { status: 500 }
    );
  }
}
