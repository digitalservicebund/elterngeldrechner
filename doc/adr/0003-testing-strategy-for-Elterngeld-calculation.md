# 2. Matomo API Access

Date: 2025-03-04

## Status

Accepted by Engineering (Thore, Joschka, Dennis)

## Context

### Problem Statement and Motivation

The implementation of the Elterngeld calculation is known for its poor quality.
For one part the results are incorrect in many cases. For the other part the
program code itself is in no good condition. There are continuous reports of
bugs and wrong calculations. Further research has shown even more issues deep
inside the algorithm. Also external factors like the discontinued tax
calculation library caused immense trouble and uncovered old issues also.

The current state makes it pretty hard to find and fix bugs. The same goes for
adaptations caused by changing regulations. This is especially the case because
the test strategy does not allow for secure refactoring, extension and bug fixes.
Partially, because the tests themselves are incorrect. Or because it just
doesn't cover enough of the logic.

Moreover, there is some desire to improve the calculations interface. It should
be possible to reevaluate the inputs and outputs from a generic use-case.
Potentially even extending the inputs for more depth of detail. It's up to the
caller to make certain abstractions and simplifications. Anyhow, such changes
are hardly possible right now without losing full confidence in the calculated
results.

With the continuous trouble to make changes to the algorithm, a new test
strategy is desired to help with the situation.

### Information Sources

Working on the implementation requires knowledge about the actual specification.
The Elterngeld calculation is described by multiple sources. These build on top
of each other and vary in level of detail or quality.

#### The Law

The law "Gesetz zum Elterngeld und zur Elternzeit (Bundeselterngeld- und
Elternzeitgesetz - BEEG)" provides the root description of the Elterngeld
calculation. Some aspects have many details like the Ersatzrate or the blanket
Sozialabgaben. Other aspects are rather open. Parts like the calculation of
Steuerabgaben actually can't be further specified and use references. Overall,
the law is quite compact without much depth.

The law is publicly available to everyone in various formats.

#### The Guideline

The "Richtlinien zum BEEG" is a document by the ministry in cooperation with the
Bundesländer. It is by far more extensive and detailed compared to the law.
Plenty of terms in the law are coined with descriptions. Every aspect of the law
is described with many details. There are also various examples and scenarios to
help explain the application of the law. Some of these even include exact
numbers with step-by-step calculations. It also specifies the application of the
"Programablaufsplan für den Lohnsteuerabzug" for tax calculation.
As the guidelines relate to the whole law, it also includes many pages that are
not relevant for the (core) calculation itself.

This document is publicly available as PDF by the ministry.

#### Guideline Attachments

Separated from the guidelines is the "Anhang zu den Richtlinien". It starts with
an incomplete glossary. Though, with higher specificity as the guidelines
themselves. It also contains an abstract step-by-step description of the overall
calculation.
Moreover, it includes plenty of example calculations for different scenarios.
The first group of cases focuses on the calculation of the Elterngeld-Netto im
Bemessungszeitraum. The second on Elterngeld im Bezugszeitraum, taking the
former as given.

This document does not seem to be publicly accessible (not confirmed).

#### More Sources

By coincidence we found the so-called "Dombatzi-Spickliste". It contains 352
entries of Bezugswerte and their Ersatzrate as well as the resulting amount for
Basiselterngeld.
According to the ministry, there is no public accessible resource of this table.

We are in contact with the Fraunhofer-Institut für Angewandte
Informationstechnik FIT (Mikrosimulation und ökonometrische Datenanalyse). They
have supported the ministry (including the Elterngeldrechner project) for years
already, long before we got involved. The ministry often recommends the
institute as a contact for detailed questions about how something gets calculated.
In addition to their private internal calculator, they share an implementation
in Microsoft Visual Basic for Applications via a spreadsheet (Excel) with us.
Furthermore, we inherited a few spreadsheets with test cases.
It must be stated that the current implementation has its origin in the VBA
Excel macros of the institute. It was translated to Java and from there to
TypeScript. The exact story has not been transmitted.
Access to the different spreadsheets is kinda "private", though public due to
the open source code of ours.

Moreover, we are in touch with the Elterngeldstelle in Berlin
Marzahn-Hellersdorf. We did some manual testing at their office to compare the
results for different scenarios. They contribute helpful details from their
daily practice and share their knowledge of the Fachverfahren.
The offices are for the public and provide professional guidance for parents.

### The current State

#### Original Test Suite

The calculation is kind of complex and has a huge input space with interesting edge
cases. During recent work on bug fixes and (necessary) refactoring, the tests
have been already largely extended. The following numbers try to exclude these
as the recent extensions, as they are seen as preparation work for this
document strategy (to some degree).

The test suite contains about 116 unit/integration tests for the calculation.
There are some low level units under test like some "math" functions. But many
fundamental building blocks/units are not tested on this level. This is
partially due to a weak separation of the calculation aspects. Many of the tests
are some kind of integration tests as they test bigger parts of the calculations
in composition.

Additionally there are 145 test cases used from the Frauenhofer-Institut
spreadsheets. 97 additional defined tests are ignored, as they do not pass. In
the following, these tests are called the FIT tests.
These tests basically ensure that the two implementations (theirs and ours)
calculate the same result for enough cases. Thereby they are the most part
"system component" tests, as they exercise the calculation algorithm as a whole.
Though, there are also test cases for the so-called intermediate calculation
result. This is possible as both calculators have the same origin.

There is no active monitoring of the test coverage. Quick experiments for the
purpose of this document show that it is something about 90%.

#### Recent Additions

The recent extensions added about 2.500 new test cases. This number is a little
simplified, as it is more complicated. To some degree, this includes plenty of
parameterized tests based on public "base-line" tables (e.g. by the
Programmablaufpläne or the Dombatzi-Spickliste). On the other hand, there are
some property tests emerging, which actually count up to tens of thousands of
test runs. In any way, the additions are plenty.

Most new test cases focus on low level units that have been already
re-implemented and include bug fixes. Furthermore, there is a refactoring
property test case in place for a while. They use an archived version of the
algorithm as base-line for regression tests with the production code. With the
help of this property test, many simple code refactoring were possible.
Unfortunately we hit the limits of these tests already. Bug fixes need to be
backported in a minimal manner and inputs/output formats must align to a high
degree. In some aspects, these tests actually limit us right now. But they are
an important safety net.

The most recent addition are some characterization tests, sometimes also called
golden master tests. While providing similar guarantees as regression tests,
they are allowed to be much more dumb. Without any concern for correctness they
purely record the current state of the algorithm as a base-line to avoid
unintended changes.

With the current test suite the, the test coverage is almost at 100%. Anyhow, as
we do not properly measure coverage, take these numbers with a grain of salt.
Also, test coverage is still a weak evaluation point, giving no certainty in
correctness.

#### More Issues

Despite the lack of "enough" tests, the quality is an issue too. For example 40%
of the FIT test cases are skipped. So only the currently happy cases are used.
That does not provide much trust in the correctness, but are rather some over
complicated regression tests. Furthermore, the FIT spreadsheets are quite old.
Certain parameters and aspects of the calculation change continuously over time
(like blanked amounts or the tax calculation). So they always only focus on
a short period of time of Elterngeld and thereby a minor user-group. Especially
since the latest state is not covered. As there are only a few unit tests for
low level building blocks, this is a big concern.

The test results with the most value for correctness come from the comparison
with productive calculators of public offices. Correctness is a relative term in
this context. The law itself does not describe a 100% correct calculation. Nor
do the guidelines or any other known source. In the end, the parents get their
Elterngeld amount calculated by the public offices. So a comparison with them
provides the most realistic values of what parents can expect in reality.
Unfortunately, such tests are currently very rare and hard to implement. In the
recent history there was only a single meeting for such manual testing. It was
only a single office with one calculator implementation. There is currently no
strategy to include more offices/implementations, more frequent tests, nor any
kind of automation.

After all, there is no one source of truth for what is correct and what is not. At
least not to a degree that a technical, automated test suite requires. Anyhow,
the Elterngeld calculation as a component itself has the advantage of having no
external dependencies (taking the current internal tax calculation). That
simplifies some aspects of extensive testing intensively.

## Decision

The primary goal of the new test strategy is to improve trust and
reliability. This is especially important to allow for adaptations and bug
fixes. Furthermore, it is a high priority to protect against regression. In
regards to the current situation, it is the idea to build up a traditional test
pyramid.

### 1st Level

On the floor of the pyramid are the low level units. For the Elterngeld
calculation these are for example the determination of the Ersatzrate, calculate
the Einkommensersatzleistung, Steuerabgaben, Sozialabgaben and many more.
The first step should be to work out these units and separate them clearly from
each other. The refactored code should be inspired strongly by the law and
guidelines where possible. It must use the terminology of the domain. Also
references to what a unit implements from the regulations is very helpful for
future work and maintenance. Such cleanness avoids already many mistakes or
makes them more obvious when comparing with the specification.

The created units should be covered by tests extensively for a strong
foundation. Using test-driven-development only works to some degree. The
resulting behavior descriptions must be complemented by parameterized tests of
known sources. Good examples are the test tables of the Programmablaufpläne or
the Dombatzi-Spickliste.

Moreover, many aspects of the calculation can be described in property tests. As
the input space is typically huge, it is helpful to test for certain known
properties for arbitrary input ranges. Such tests quickly push the trust and
certainty of the tests. Including border values of the input ranges is a good
practice and can be nicely integrated with property tests.
As already demonstrated by the recent work, these tests are absolutely feasible
and provide a great boost. They also uncovered weaknesses for edge cases
already.

### 2nd Level

On the next level, units are put together to describe the overall calculation
process. This should be related to the abstract descriptions in the guideline
attachments or similar resources where possible.

Testing these units is a little more complicated. Mocking the surroundings, it
leaves them mostly with orchestration logic only. This can be beautifully
developed using test-driven-development. Property tests might be applicable
here. Some creativity will be needed.

### 3rd Level

The examples of the guidelines and their attachments make up for some wonderful
integration tests. There are not too many of them and they mostly focus on two
integration points. But they come directly from the specification.

The scenarios for the Elterngeld-Netto only work with births from 2021. Which we
do no more support. So we will need to add this, even though it has no use-case
for production.

The format for these tests is not yet clear. The documents do not use a strict
uniform schema. So a behavior-driven-development approach is questionable. But
it might be a long term vision. Also for extensibility.

These tests add some constraints on how to compose the algorithm to actually
have these integration points with the given parameters. These currently do not
exist and need to be established.

### 4th Level

As the final step, the calculation needs to be tested as a whole. Currently this is
done by the FIT tests, the refactoring property tests and the characterization
tests. The latter two don't test for correctness. The refactoring properties
also need to be phased out to allow for deeper refactoring.
The FIT tests actually test for correctness. But they are partially very old,
somewhat incorrect and apparently not enough to protect against obvious bugs.
Additionally its very cumbersome to keep them updated, the format changes over
time, the communication is slowish and the actual correctness properties are
questionable. It is likely that we will start to phase these tests out. Though,
it might be worth it to inspect the 97 currently ignored test cases and see if
we can enable them again due to fixes on our side.

The correctness of the calculation can be defined as producing the same results
as the calculators of the public offices. There are plenty of them and there are
also known to be multiple implementations in use. After all, parents will get
their actual Elterngeld calculated by these. Aligning with them should be key.
Deviations should be used as conversation starters to align on the
interpretation of specification details.

The idea is to establish some behavior-driven-tests that can be used in the
automated test suite of this project. They also need to be evaluated by multiple
public offices. The test cases should be variant enough to actually cover many
relevant real world scenarios. But it must be less enough, so the effort for the
civil servants remains manageable. Better start with just a few cases and try to
grow circumference, as well as participants.
Each participant should hand in their result in a provided form. The automated
test suite should then compare its own result with all the collected ones and
check the difference. Low differences are expected and should not be a deal
breaker. It should not matter if there is just a difference of 2€. That has no
impact for the user. Larger differences must be investigated. Failing tests of
this sort should not break the continuous integration or deployment pipeline.
But they must be notified and handled.

These kinds of tests will require a lot of organisational effort. We are highly
dependent without established connections. But these tests will provide the
highest possible feedback for the correctness of the calculation.

### Summary

The strategy can be summarised as the following, including numerous action
items.

The code will be refactored step-by-step. Having an implementation that follows
more closely along the specification documents should improve precision,
readability, maintainability and avoid conceptual bugs from the get go. It also
allows the establishment of more high quality tests. This has already been
started successfully.

The set of unit tests will be largely extended. Composed of tests as the result
of test-driven-development during refactoring, complemented with parameterized
tests, property tests. Input space border values have to be included too. Such
tests have been introduced already and will be continued.

Adding unit tests for important integration points representing the abstract
calculation algorithm, including standard techniques like mocking.

Once the necessary integration points are in place, integration test cases will
be added based on the example cases of the specification documents. Specifically
the scenarios from the guideline attachments. A specification close test
description schema must be developed.

At least one simple characterization test covers the whole calculation component
to enable refactoring and protect against dull regression. The closely related
refactoring property tests will be phased out with ongoing work.

The skipped FIT test cases will be re-evaluated. Furthermore it will be
evaluated how the Excel calculator based on the spreadsheet macros can be used
for automated testing without depending on external test writing. The applicable
time frame for the inputs must be strongly encoded.

And finally we will try to arrange a group of voluntary Elterngeldstellen with
the ministry that are willing to take part and support us. With their input, we
will create a list of scenarios using a behavior-driven-design-language. We will
also provide a form that allows them to uniformly file the results. An automated
test must be written that can parse the scenarios and compare the results. It
should also be discussed early how to act on high derivations and how to
continuously update the results on regulatory changes.

## Consequences

There testing must go hand in hand with refactoring of the algorithm itself.
The testing strategy has an impact on the structure of the code to allow the
integration tests to be applied.
It is possible that the 4th level will not succeed or will result just in a very
small number of tests and results to compare with. Also the communication might
be inefficient and failing tests will linger around for a long period of time.
