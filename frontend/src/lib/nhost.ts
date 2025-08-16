import { NhostClient } from '@nhost/react';

const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || 'localhost',
  region: process.env.REACT_APP_NHOST_REGION || 'us-east-1',
});

export { nhost };
