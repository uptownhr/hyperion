import * as express from 'express';
import { setQueues, UI } from 'bull-board';
import * as bull from 'bull';

import { run } from './queue';
import { run as runWorker } from './worker'
import { redisOptions } from './lib/consts';

run();
runWorker();

const q = new bull('test q', redisOptions);
setQueues([q]);

const app = express();
app.use(UI);
app.listen(9999);
