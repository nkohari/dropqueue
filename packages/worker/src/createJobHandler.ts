import axios from 'axios';
import { Job, Logger } from '@dropqueue/common';

export function createJobHandler(log: Logger) {
  return async (job: Job): Promise<void> => {
    log.info(`Handling job ${job.id}: requesting ${job.url}`);

    try {
      const response = await axios.get(job.url);
      if (response.status !== 200) {
        job.status = 'failed';
        job.error = response.statusText;
      } else {
        job.status = 'completed';
        job.content = response.data;
      }
    } catch (error) {
      job.status = 'failed';
      job.error = error.message || String(error);
    }

    if (job.status === 'failed') {
      log.info(`Job ${job.id} failed: ${job.error}`);
    } else {
      log.info(`Job ${job.id} completed: read ${job.content!.length} bytes`);
    }
  };
}
