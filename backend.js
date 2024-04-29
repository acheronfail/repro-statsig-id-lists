import { inspect } from 'node:util';
import Statsig from 'statsig-node';
import c from 'chalk';

const error = new Error('Not implemented');

const loggingDataAdapter = {
  initialize: async () => console.log(c.yellow('[data adapter] init')),
  shutdown: async () => console.log(c.yellow('[data adapter] shutdown')),
  supportsPollingUpdatesFor: (key) =>
    console.log(c.yellow(`[data adapter] supportsPollingUpdatesFor: ${key}`)) || false,

  get: async (key) => {
    console.log(c.yellow(`[data adapter] get: ${c.cyan(key)}`));
    return { error };
  },

  set: async (key, value, time) => {
    let msg = c.yellow(`[data adapter] set: ${c.cyan(key)} -> `);
    if (key.startsWith('statsig.id_lists::')) {
      const count = value.split('\n').length;
      msg += c.red(`${value.slice(0, 40).replace(/\n/g, '\\n')}... (approx: ${count})`);

      // change our exit code here so we know the behaviour has been reached
      process.exitCode = 1;
    } else {
      const inspectOptions = { colors: true, compact: true, depth: 0 };
      try {
        msg += inspect(JSON.parse(value), inspectOptions);
      } catch {
        msg += c.red(inspect(value, inspectOptions));
      }
    }

    console.log(msg);
    return { error };
  },
};

console.log('Statsig.initializeAsync');
await Statsig.initialize(process.env.STATSIG_SERVER_SDK, {
  localMode: false,
  dataAdapter: loggingDataAdapter,
});

await Statsig.syncConfigSpecs();
await Statsig.syncIdLists();
