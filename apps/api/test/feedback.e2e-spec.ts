import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AppModule } from 'src/app.module';
import { FindAllResponse } from 'src/feedback/type/types-returned-data';
import request from 'supertest';
import { App } from 'supertest/types';

describe('Feedback Controller (e2e)', () => {
  let app: INestApplication<App>;
  let userAToken: string;
  let userBToken: string;
  let adminToken: string;
  let feedbackAId: string;

  beforeAll(async () => {
    const moduleTexture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleTexture.createNestApplication();
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    //подготовка
    const login = (email: string) =>
      request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email, password: 'root' });

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'userA@test.com', password: 'root', name: 'User A' });

    const resA = await login('userA@test.com');
    userAToken = resA.body.access;

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'userB@test.com', password: 'root', name: 'User B' });

    const resB = await login('userB@test.com');
    userBToken = resB.body.access;

    const resAdmin = await login('admin@corporate.com');
    adminToken = resAdmin.body.access;
    //подготовка
  });

  describe('Создание и видимость', () => {
    it('Юзер А создает ПРИВАТНЫЙ АНОНИМНЫЙ пост', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/feedback')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Секретный фидбек',
          content: 'Это видит только автор и админ',
          category: 'OFFICE',
          isPrivate: true,
          isAnonymous: true,
        })
        .expect(201);

      feedbackAId = res.body.id;
    });

    it('Юзер Б НЕ должен видеть приватный пост Юзера А', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback')
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(200);

      const body = res.body as FindAllResponse;
      const found = body.find((f) => f.id === feedbackAId);
      expect(found).toBeUndefined(); // Пусто, flatMap отфильтровал
    });

    it('Админ ДОЛЖЕН видеть приватный пост, но БЕЗ автора (так как анонимно)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const body = res.body as FindAllResponse;
      const found = body.find((f) => f.id === feedbackAId);
      expect(found).toBeDefined();
      expect(found!.author).toBeNull();
      expect(found!.authorId).toBeNull();
    });

    it('Юзер А ДОЛЖЕН видеть свой анонимный пост С СОБОЙ в качестве автора', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feedback')
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);

      const body = res.body as FindAllResponse;
      const found = body.find((f) => f.id === feedbackAId);
      expect(found!.author).not.toBeNull();
      expect(found!.author!.name).toBe('User A');
    });
  });

  describe('Безопасность удаления', () => {
    it('Юзер Б не может удалить пост Юзера А (403)', () => {
      return request(app.getHttpServer())
        .delete(`/api/feedback/${feedbackAId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .expect(403);
    });
    it('Юзер А может удалить свой пост в статусе PENDING', () => {
      return request(app.getHttpServer())
        .delete(`/api/feedback/${feedbackAId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
