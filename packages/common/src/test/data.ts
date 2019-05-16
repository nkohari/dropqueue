import { Job } from '@dropqueue/common';

export const dummyJobs: Record<string, Job> = {
  abc123: {
    id: 'abc123',
    url: 'https://example.org',
    status: 'queued',
  },
  def456: {
    id: 'def456',
    url: 'https://example.org/foo',
    status: 'completed',
    content: '<marquee>welcome</marquee>',
  },
  xyz789: {
    id: 'xyz789',
    url: 'https://example.org/bar',
    status: 'failed',
  },
};
