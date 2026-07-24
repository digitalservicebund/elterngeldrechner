# 10. Abfrageteil

Date: 2026-05-11

## Status

- Accepted by: Dennis & Jakob

## Context

We have re-implemented the /abfrageteil in /abfrageteil-next and are at
a point where the feature works as expected but carries some technical
debt that is described in more detail later in this document.

The main reason for the re-implementation of the abfrageteil is not a
technical one but a change in the way parents are guided through the
forms, i.e. not linear but with multiple possible branches based on
the entered data.

## History

When working with the legacy version of the abfrageteil we often wrestled
with the many nullable fields in the state and also the verbose setup of
redux. The re-implementation was meant to solve these issues in a more
elegant way.

## Requirements

- The form flow changed from linear to having multiple possible branches
- The form includes loops to collect input for Geschwister and Tätigkeiten
- Users should be able to navigate back (and maybe forth) in the sidebar
- The pages are kept relatively small and follow "one context per page"

## Decision

Based on the requirements above and experience mentioned earlier we decided
to implement the new version of the feature using an append-only list of
events. Additionally we committed to the use of zod for form validation.

## Wins

Pruning stale branches comes for free with the described architecture
because we can, after each decision, find the point where the new flow
derives from the old one and cut off outdated events.

The backward navigation is easily implemented as well by routing to the
last events path and restoring its payload.

Persistence in and of itself is just as easy as with one big object of
application state but having the atomic events we theoretically are able
to restore the flow partially.

Pages are kept relatively simple as they default to the last event of
its schema and append the new event after submit. The components focus
on the form part only. At least in theory.

## Drawbacks

### Type information and runtime errors

The main drawback is that we lost compiler support and
have to search through the event array for every information
which results in `throw new Error(...)` in a couple of places.

The consequence of that is that we break with the mantra "make
illegal state unrepresentable" and further throw runtime errors
that we cannot recover from in a meaningful way.

### Requirements of pages

Additionally we realized that the pages need information from
previous pages in more and more cases. We have not thought about
this in the concept and assumed that the pages can be just plain
collections of inputs, validated against a given schema.

### Information required in routing

In some cases the `findeNaechstenPfad` function requires more info
than it would get if passed solely the values submitted by the form
on the page. The workaround for now is to query the missing info on
the page and extend the schema by it, just for the routing.

## Ideas for improvements

### Error handling in projections

Instead of throwing runtime errors an incremental improvement could
be to return an error type. The call side then could route back to
the missing page on error. However, this might not solve the practical
problems but possibly shift the problem simply to the call side.

### State as discriminated union

We could rewrite the state modelling shifting from the append-only list
of events to a strongly typed discriminated union that represents the
phases allgemein, kind, antragstellerin and partnerin. However, that
also means loosing the free prune stale branches feature and would
require to implement all state changes explicitly.

### Pass eventStream to routing

In order to keep the schemas atomic and take the querying reponsibility
off the pages, the full eventStream could be passed to the routing
function which then could also be exposed partially applied via
the event context.

## Comparison to other patterns

### Redux with slices

Implementing the feature in the original pattern using redux and slices
would mean that the state is always fully typed and available without
projection. However, in that case the history is discarded after each
action and pruning stale branches would require explicit implementation.

### State machines

State machines are a pattern we considered early on but dropped due to
its complexity and learning curve. The wins would be that routing conditons
could be expressed as type guargs on transitions, which would eliminate the
invariant assetion that currently throw at runtime.

## Future direction

The current architecture should be seen as the best possible compromise for
the time being, that allowed us to ship the feature under time constraints
and still introduce a new architecture, which is improves and simplifies
the logic of the abfrageteil. Future iterations may introduce
projections or a more strongly typed state model.
