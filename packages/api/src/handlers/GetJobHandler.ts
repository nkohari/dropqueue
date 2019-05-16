import * as Boom from 'boom';
import { Request } from 'hapi';
import * as Joi from 'joi';
import { Handler } from '../Handler';

interface GetJobRequest extends Request {
  params: {
    id: string;
  };
}

export class GetJobHandler extends Handler {
  route = 'get /jobs/{id}';

  schema = {
    params: {
      id: Joi.string(),
    },
  };

  async handle(request: GetJobRequest) {
    const { id } = request.params;
    const job = await this.database.getJob(id);

    if (!job) {
      return Boom.notFound(`No job with the id ${id} was found`);
    } else {
      return job;
    }
  }
}
