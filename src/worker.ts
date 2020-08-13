import axios from 'axios';
import { Job, Worker } from 'bullmq';
import { httpCheck } from './lib/consts';
import * as redis from 'redis';

const redisOptions = {
  port: 6379,
  host: 'localhost',
};
const client = redis.createClient(redisOptions);

interface testJob extends Job {
  data: httpCheck;
}

interface httpCheckResult {
  success: boolean;
  responseTime: number;
}

export async function run() {
  const testW = new Worker(
    'test q',
    async (job: testJob): Promise<httpCheckResult> => {
      const start = new Date();

      const { url, method, assertion } = job.data;
      const res = await axios
        .request({
          url,
          method,
        })
        .then((res) => res)
        .catch((err) => err.response);
      const end = new Date();

      return {
        success: res
          ? res.status === assertion.status && assertion.body
            ? res.data === assertion.body
            : false
          : false,
        responseTime: end.getTime() - start.getTime(),
      };
    },
    { client }
  );

  testW.on('waiting', ({ name }) => {
    console.log(`A job with ID ${name} is waiting`);
  });

  testW.on('active', ({ name, prev }) => {
    console.log(`Job ${name} is now active; previous status was ${prev}`);
  });

  testW.on('completed', (job: testJob) => {
    console.log('completed', job.name, job.returnvalue, job.data);
  });

  testW.on('failed', (job) => {
    console.log('failed', job.name, job);
  });
}
