# Metrics Synchronization

The **Metrics Synchronization** component is a vital part of our analytics infrastructure. It bridges **Matomo**,
our analytics platform, with **NocoDB**, the data layer powering **Metabase**, ensuring data is consistently updated
and structured for reporting and visualization.

```
+-----------+             +----------------+             +-----------+             +------------+
|           |             |                |             |           |             |            |
|  Matomo   +-------------+ GitHub Action  +-------------+  NocoDB   +-------------+  Metabase  |
|           |             |   (Nightly)    |             |           |             |            |
+-----------+             +----------------+             +-----------+             +------------+
```

## Requirements

- **Node.js**: Ensure that the Node.js runtime is installed.
- **Credentials**: Credentials for nocodb and matomo can be found in our 1password team vault.
- **Environment Variables**: Expected in a .env.local file, containing all variables used by [env.ts](env.ts).

### Environment Variables

Use the provided `.env.example` file as a reference and create a `.env.local` with your own values. To load these
variables into your shell, run `export $(xargs < .env.local)`.

## Synchronization of old data

Sometimes you may need to backfill old data — for example, when setting up Metabase synchronization after metrics
have already been collected in Matomo. You can use the [sync-days.sh](sync-days.sh) script for that job.
