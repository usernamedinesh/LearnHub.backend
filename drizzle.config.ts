import { defineConfig } from 'drizzle-kit';
import { env } from 'src/config/env.config';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/schema',

  dbCredentials: {
    url: env.DATABASE_URL,
  },

  extensionsFilters: ['postgis'],
  schemaFilter: 'public',
  tablesFilter: '*',

  introspect: {
    casing: 'camel',
  },

  migrations: {
    prefix: 'timestamp',
    table: '__drizzle_migrations__',
    schema: 'public',
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: [],
    },
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
