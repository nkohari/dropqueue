import { Job, JobStatus, MockDatabase, MockLogger } from '@dropqueue/common';
import { Configuration } from '../config';
import { ClusterWorker } from '../ClusterWorker';

const config: Configuration = {
  redisUrl: '',
  workers: 0,
};

const database = new MockDatabase();
const log = new MockLogger();

afterEach(() => {
  database.reset();
});

describe('ClusterWorker', () => {
  it('calls handler for queued jobs', async () => {
    const expected = {
      status: 'completed',
      content: 'it worked',
    };

    const handler = async (job: Job) => {
      job.status = expected.status as JobStatus;
      job.content = expected.content;
    };

    const worker = new ClusterWorker(config, database, log, handler);
    worker.start();
    database.flushWaitingCallbacks();

    process.nextTick(() => {
      expect(database.getJob('abc123')).resolves.toMatchObject(expected);
    });
  });
});
