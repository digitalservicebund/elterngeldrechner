# 2. Matomo API Access

Date: 2025-01-20

## Status

Accepted by Engineering (Dennis), Growth Management (Anna) and Product (Marie)

## Context

We started working on a more accessible dashboard using metabase a while ago. In order to provide metabase with the
necessary data, we run a nightly github action that pulls data from matomo and pushes it to the database behind
metabase. Access to the data is possible via two ways: Using the matomo reporting api to query aggregated data by
day, month, or year or direct access to the underlying mysql database.

## Decision

We have chosen to use the matomo reporting api to synchronize daily aggregated event data each night. This approach
allows us to operate independently of the third-party company managing the matomo instance and provides flexibility
in data synchronization.

## Consequences

By using the reporting api, we may experience slight discrepancies when viewing monthly aggregations in metabase
compared to matomo’s results. This is because the data we aggregate daily might be fewer events than matomo’s monthly
calculations, leading to potential minor differences in the totals.
