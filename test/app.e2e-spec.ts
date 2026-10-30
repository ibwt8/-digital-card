import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('returns profile through GraphQL', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `{
          profile {
            id
            name
            description
            skills { id name }
            links { id label url }
            projects { id name url }
            experience {
              id
              company
              position
              startedAt
              endedAt
              achievements
            }
          }
        }`,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profile).toMatchObject({
      id: 'main',
      name: expect.any(String),
      description: expect.any(String),
    });
    expect(response.body.data.profile.skills).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'skill-typescript',
          name: 'TypeScript',
        }),
      ]),
    );

    const profile = response.body.data.profile;

    expect(profile.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'link-hh',
          label: 'HH',
          url: expect.any(String),
        }),
      ]),
    );

    expect(profile.projects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'project-1',
          name: expect.any(String),
          url: expect.any(String),
        }),
      ]),
    );

    expect(profile.experience).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'experience-1',
          company: expect.any(String),
          position: expect.any(String),
          startedAt: expect.any(String),
          achievements: expect.arrayContaining([expect.any(String)]),
        }),
      ]),
    );
  });

  afterEach(async () => {
    await app.close();
  });
});
