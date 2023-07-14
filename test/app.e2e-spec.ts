import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import Spec from 'pactum/src/models/Spec';
describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3400);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'blow@gmail.com',
          password: 'blow',
        };
        pactum
          .spec()
          .post('http://localhost:3400/auth/signup')
          .withBody(dto)
          .expectStatus(201)
          .inspect();

      });
    });
    describe('Signin', () => {
      it.todo('should signin');
    });
  });
  describe('User', () => {
    describe('Get me', () => {});
  });
  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
});
