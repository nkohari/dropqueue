import { Job } from '@dropqueue/common';
import { Tester } from './Tester';

let tester: Tester;

beforeAll(() => {
  tester = new Tester();
});

afterEach(() => {
  tester.database.reset();
});

describe('CreateJobHandler', () => {
  it('returns 201 and the created job', async () => {
    const response = await tester.post('/jobs', {
      url: 'https://example.org',
    });
    expect(response.statusCode).toBe(201);
    expect(response.result).toMatchObject({
      url: 'https://example.org',
      status: 'queued',
    });
  });

  it('returns a location header to the canonical url for the created action', async () => {
    const response = await tester.post('/jobs', {
      url: 'https://example.org',
    });
    const result = response.result as Job;
    expect(response.statusCode).toBe(201);
    expect(response.headers).toMatchObject({
      location: `${tester.config.baseUrl}/jobs/${result.id}`,
    });
  });
});
