import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto/auth.dto';
import Spec from 'pactum/src/models/Spec';
import { EditUserDto } from '../src/user/dto/editUser.dto';
import { CreateBookmarkDto } from 'src/bookmark/dto/createBookmark.dto';
import { EditBookmarkDto } from 'src/bookmark/dto/editBookmark.dto';
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
    pactum.request.setBaseUrl('http://localhost:3400');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('should throw error if no email', async () => {
        const dto: AuthDto = {
          email: 'blow@gmail.com',
          password: 'blow',
        };
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if no password', async () => {
        const dto: AuthDto = {
          email: 'blow@gmail.com',
          password: 'blow',
        };

        await pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.password,
          })
          .expectStatus(400);
      });
      it('should signup', async () => {
        const dto: AuthDto = {
          email: 'blow@gmail.com',
          password: 'blow',
        };
        await pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should signin', async () => {
        const dto: AuthDto = {
          email: 'blow@gmail.com',
          password: 'blow',
        };
        await pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get authenticated user', async () => {
        await pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit User', () => {
      it('should update user', async () => {
        const dto: EditUserDto = {
          email: 'blow@gmail.com',
          firstName: 'blow',
          lastName: 'muili',
        };
        await pactum
          .spec()
          .patch('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .inspect();
      });
    });
  });
  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it('should create bookmark', async () => {
        const dto: CreateBookmarkDto = {
          title: 'learn sql',
          description: 'Learning sql link so i dont forget',
          link: 'https://www.codecademy.com/learn/learn-sql',
        };
        await pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('bookmarkId', 'id')
          .expectStatus(201);
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', async () => {
        await pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark', async () => {
        await pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit bookmark by id', () => {
      it('should edit bookmark', async () => {
        const dto: EditBookmarkDto = {
          title: 'learn New sql',
          description: 'Learning sql link so i dont forget',
          link: 'https://www.codecademy.com/learn/learn-sql',
        };
        await pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .stores('bookmarkId', 'id')
          .expectStatus(200);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', async () => {
        await pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .stores('bookmarkId', 'id')
          .expectStatus(204);
      });

      it('should get empty bookmarks', async () => {
        await pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectJsonLength(0)
          .expectStatus(200);
      });
      
    });
  });
});

