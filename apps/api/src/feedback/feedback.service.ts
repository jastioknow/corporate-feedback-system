import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prismaOrm/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackStatusDto } from './dto/update-feedback-status.dto';
import { Role } from '@corporate/db';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto, userId: string) {
    return await this.prisma.client.feedback.create({
      data: {
        ...dto,
        authorId: userId,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateFeedbackStatusDto) {
    const hasFeedBack = await this.prisma.client.feedback.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!hasFeedBack) throw new NotFoundException('Фидбэк не найден');

    return await this.prisma.client.feedback.update({
      where: { id },
      data: { status: dto.status, adminReply: dto?.adminReply },
    });
  }

  async findAll(userId: string, role: string) {
    const feedbacks = await this.prisma.client.feedback.findMany({
      where: {},
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return feedbacks.flatMap((item) => {
      if (item.isPrivate) {
        if (role === Role.ADMIN || item.authorId === userId) {
          if (item.authorId === userId) return item;
          if (item.isAnonymous) return { ...item, author: null, authorId: null };
          return item;
        }
        return [];
      }

      if (item.isAnonymous) {
        if (item.authorId === userId) {
          return item;
        }
        return { ...item, author: null, authorId: null };
      }
      return item;
    });
  }

  async remove(id: string, userId: string) {
    const feedback = await this.prisma.client.feedback.findUnique({ where: { id } });

    if (!feedback) throw new NotFoundException('Отзыв не найден');

    const isOwner = feedback.authorId === userId;

    if (!isOwner || feedback.status !== 'PENDING') {
      throw new ForbiddenException('У вас нет прав на удаление этого отзыва');
    }

    await this.prisma.client.feedback.delete({ where: { id } });

    return { success: true, id };
  }
}
