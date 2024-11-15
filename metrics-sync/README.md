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
