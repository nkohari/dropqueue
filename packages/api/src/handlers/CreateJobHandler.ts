import { Request, ResponseToolkit } from 'hapi';
import * as Joi from 'joi';
import { Handler } from '../Handler';

interface CreateJobRequest extends Request {
  payload: {
    url: string;
  };
}

export class CreateJobHandler extends Handler {
  route = 'post /jobs';

  schema = {
    payload: Joi.object({
      url: Joi.string().uri({ scheme: ['http', 'https'] }),
    }),
  };

  async handle(request: CreateJobRequest, h: ResponseToolkit) {
    const { url } = request.payload;
    const job = await this.database.createJob(url);
    return h.response(job).created(`${this.config.baseUrl}/jobs/${job.id}`);
  }
}
