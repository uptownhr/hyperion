import { Queue, QueueScheduler, JobsOptions } from 'bullmq';
import * as redis from 'redis';
import {redisOptions, httpCheck} from './lib/consts';

interface test extends Queue {
  add(name: string, data: httpCheck, opts?: JobsOptions);
}

export async function run() {
  const client = redis.createClient(redisOptions);
  
  const testQScheduler = new QueueScheduler('test q', { client });
  const testQ = new Queue('test q', { client }) as test;

  const ttttt = await testQ.add(
    'fifth',
    {
      url: 'https://www.jlee.biz',
      method: 'GET',
      assertion: {
        status: 200,
      },
    },
    {
      repeat: {
        every: 5000,
      },
      removeOnComplete: 100,
      removeOnFail: 100
    }
  );
}

