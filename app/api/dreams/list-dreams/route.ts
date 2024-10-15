import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const dreams = await prisma.dream.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { date: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      likes: {
        select: {
          id: true,
          userId: true,
        },
      },
      comments: {
        select: {
          id: true,
          userId: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    skip,
    take: limit,
  });

  const totalDreams = await prisma.dream.count({
    where: { userId: Number(session.user.id) },
  });

  return NextResponse.json({
    dreams,
    totalPages: Math.ceil(totalDreams / limit),
    currentPage: page,
  });
}
