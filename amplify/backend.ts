import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { CustomDatabase } from './custom/customdatabase/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

const customDatabase = new CustomDatabase(
  backend.createStack('CustomDatabase'),
  'CustomDatabase',
);

backend.addOutput({
  custom: {
    db: customDatabase,
  },
});
