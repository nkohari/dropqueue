import { Job, dummyJobs } from '@dropqueue/common';
import { Tester } from './Tester';

let tester: Tester;

beforeAll(() => {
  tester = new Tester();
});

describe('GetJobHandler', () => {
  it('returns the job if it exists', async () => {
    const response = await tester.get('/jobs/abc123');
    const result = response.result as Job;
    expect(response.statusCode).toBe(200);
    expect(response.result).toMatchObject(dummyJobs.abc123);
  });

  it('returns 404 if the job does not exist', async () => {
    const response = await tester.get('/jobs/does-not-exist');
    expect(response.statusCode).toBe(404);
  });
});
