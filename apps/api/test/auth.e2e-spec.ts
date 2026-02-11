import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  const tokens = { access: '', refresh: '' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser());
    await app.init();
  });

  describe('/api/auth/register (POST)', () => {
    const newUser = {
      email: `test-${Date.now()}@test.com`,
      password: 'test',
      name: 'Tester',
    };

    it('Should register user, set refresh cookie and return access token on valid data', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(newUser)
        .expect(201);

      expect(res.body).toMatchObject({
        user: {
          email: newUser.email,
          id: expect.any(String),
          role: expect.any(String),
        },
        access: expect.any(String),
      });
      expect(res.body.user.password).toBeUndefined();
      expect(res.get('Set-Cookie')?.[0]).toContain('refresh=');
      expect(res.get('Set-Cookie')?.[0]).toContain('HttpOnly');
    });

    it('Should return 409 (Conflict) when email is already registered', async () => {
      const email = 'duplicate@test.com';
      await request(app.getHttpServer()).post('/api/auth/register').send({
        email,
        password: '1234',
        name: 'Original',
      });

      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: '1234', name: 'Clone' })
        .expect(409);
    });

    it('Should return 400 (Bad Request) for malformed email address', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: '1234', name: 'Xxxx' })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    const { emailAdmin, passCorrect } = {
      emailAdmin: 'admin@corporate.com',
      passCorrect: 'root',
    };

    it('Should authenticate user and issue secure tokens on correct credentials', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: emailAdmin, password: passCorrect })
        .expect(200);

      expect(res.body).toMatchObject({
        user: {
          email: emailAdmin,
          id: expect.any(String),
          role: expect.any(String),
        },
        access: expect.any(String),
      });
      expect(res.body.user.password).toBeUndefined();
      expect(res.get('Set-Cookie')?.[0]).toContain('refresh=');
      expect(res.get('Set-Cookie')?.[0]).toContain('HttpOnly');

      tokens.access = res.body.access;

      const setCookie = res.get('Set-Cookie');
      const cookieStr = Array.isArray(setCookie) ? setCookie[0] : setCookie;
      tokens.refresh = cookieStr?.split(';')[0]?.split('=')[1] || '';
    });

    it('Should deny access with 401 status when password does not match', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: emailAdmin, password: 'wrong' })
        .expect(401);
    });

    it('Should return 401 for non-existent account', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'ghost@corporate.com', password: 'any1' })
        .expect(401);
    });
  });

  describe('/api/auth/profile (GET)', () => {
    it('Should return 200 on valid access token', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${tokens.access}`)
        .expect(200);

      expect(res.body).toMatchObject({
        email: expect.any(String),
        id: expect.any(String),
        role: expect.any(String),
        name: expect.any(String),
      });
      expect(res.body.password).toBeUndefined();
    });
    it('Should return 401 on invalid access token', async () => {
      return request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer grh.ehsjhr.srhrs`)
        .expect(401);
    });
  });

  describe('/api/auth/refresh & /api/auth/logout (workflow)', () => {
    it('Should rotate tokens and return new access string via refresh token', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .set('Cookie', [`refresh=${tokens.refresh}`])
        .expect(200);

      expect(res.get('Set-Cookie')?.[0]).toContain('refresh=');
    });
    it('Should clear refresh cookie on logout', async () => {
      const res = await request(app.getHttpServer()).post('/api/auth/logout').expect(204);

      const cookie = res.get('Set-Cookie')?.[0];

      expect(res.body).toEqual({});
      expect(cookie).toMatch(/^refresh=;(.*Max-Age=0|.*Expires=)/);
      expect(cookie).toContain('HttpOnly');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
