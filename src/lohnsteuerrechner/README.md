# Lohnsteuerrechner

This "package" contains logic to calculated taxes for income in Germany.

It is an implementation of the so called "Programmablaufplan für den
Lohnsteuerabzug". Which is a document by the _Bundesfinanzministerium_ (ministry
of finance) with a flowchart how to calculate taxes step by step. Though, it is
a slightly slimmer version as is leaves out some aspects that are known to have
no impact in the context of _Elterngeld_ (e.g. no pensions).
There is a new version of the flowchart at least once per year. Only the version
known on the 1st of January of the related year is relevant for _Elterngeld_.

# Technical Details

Historically, this calculation was done by "unofficial" third party dependencies
from the ministry (a library **and** a web service). With a heads up by the
ministry of finance, these dependencies became obsolete and phased out. We were
also informed that the former used solutions were known to be inaccurate. A new
(proper?) solution is in the making and will be available at some unknown point
in the future. Till then, no alternative is available. To solve this uncertain,
intermediate period of time, this package here was developed. The ultimate goal
is to get rid of this burden/responsibility and rely on an official dependency
again.

The implementation is very close to the flowcharts with an almost 1:1
projection. Because the circumstances are quite special, there is actually quite
a lot of documentation within the code that should be very helpful. It does not
explain **how** taxes work, but the detailed circumstances of the code and how
its designed. It also includes instructions how to tie up new tax years.

While not strictly supported by the flowcharts, all implemented tax years are
available via an unified interface. All flowcharts that have been implemented so
far do not introduce backwards incompatible breaking changes. So this approach
works fine and hopefully remains intact till this package gets archived.
