# dropqueue

This is a simple web scraper implemented as a job queue system using Redis as a persistence layer. Jobs are created by a REST API, and are read by a cluster of workers. Each job contains an HTTP URL that will be fetched by the worker process, and the response received will be stored with the job for subsequent retrieval.

Jobs are serialized to JSON and stored in Redis, and a list called `jobs` is used as a queue. When a new job is created, it is added to the list with `RPUSH`, and workers use a (blocking) `BLPOP` call to wait for jobs to be enqueued.

## Setup

### Installation

This project uses [yarn](https://yarnpkg.com/en/) for package management. Install it first, if needed, then run the following commands to install dependencies and set up default environment variables.

```
$ yarn
$ yarn setup
```

By default, the API server will listen on port 8082, will connect to a local Redis instance on port 6379, and two worker child processes will be spawned. To change these values, you can edit the values in `packages/api/.env` and `packages/worker/.env`.

### Development

To start the system in development:

```
$ yarn dev
```

This will run the API server and the worker process concurrently. You can also run them independently:

```
$ yarn dev-api
$ yarn dev-worker
```

### Testing

There's a small test battery that runs using Jest. To run the tests:

```
$ yarn test
```

## Usage

To create a job, send a POST to the `/jobs` endpoint:

```
$ curl -X POST -H "Content-type: application/json" -d '{"url":"https://google.com/"}' http://localhost:8082/jobs
```

The API server will reply with a 201. The `Location` header will be the canonical URL where the job can be requested, and the body will be a JSON representation of the created job:

```
{
  "id": "6-1q2JI1TZeoDiZbSoMjfg",
  "url": "https://google.com/",
  "status": "queued"
}
```

The worker process should immediately pick up the job and fetch the specified URL. To request the status of a job, send a GET to the `/jobs/{id}` endpoint:

```
$ curl http://localhost:8082/jobs/6-1q2JI1TZeoDiZbSoMjfg
```

The API server will reply with the current state of the job. If the status is `completed`, the content retrieved from the URL will be stored in the `content` property. If the status is `error`, the worker received a non-200 response, and the `error` property will contain a description of the error.

```
{
  "id": "6-1q2JI1TZeoDiZbSoMjfg",
  "url": "https://google.com/",
  "status": "completed",
  "content": "..."
}
```

## Known Limitations

1. Redis is a single point of failure. Using a cluster of Redis instances could improve this.
2. If a request fails, it will not be retried. As a result, temporary issues with network connectivity or with the sites we're trying to scrape will result in the job permanently failing. Ideally we would retry the request using exponential backoff, and if a job failed a certain number of times, it would be moved to a [dead letter queue](https://en.wikipedia.org/wiki/Dead_letter_queue).
3. If a worker process crashes while a job is being processed, it will have been removed from the `jobs` list in Redis. As a result, the job will forever remain as `queued` but won't be processed. To avoid this, each worker process should have its own list in Redis, and should use `BRPOPLPUSH` to move a job ID from the main `jobs` list to its own list when it "claims" a job. Then, on startup, the worker can check their list to see if any jobs were in-flight when it last failed. (To avoid infinite retries, this should be combined with the request count described in #2.)

Also, this needs more tests! The system is structured to allow for logical isolation boundaries for tests, but more tests should be written to exhaustively exercise each component.
