# Elterngeldrechner

This "package" contains the domain logic and algorithms to calculate the money
for _Elterngeld_.

To calculate the actual _Elterngeld_ parents get payed out, various of
information are necessary as input. These include many details about the
personal and financial situation of the parents. It is up to the user/caller to
abstract certain inputs with simplified/static data.
Additionally it is necessary to know the _Monatsplan_ for exact results,
especially for months with income during the _Elternzeit_. The calculated result
provides a detailed list of _Bezüge_ for each _Lebensmonat_.

## Technical Details

As the real-world domain is a German one, the implementation makes heavy use of
the German language. Low level or pure technical parts are using English. The
same concept goes for documentation where clean code needs some.
It is obligatory to acquire domain knowledge before interacting with the domain.
Though, the tests often use behavior-driven-design language to describe the
tested behavior.

The code within this package has a long history. It origins in an implementation
as macros within an Excel spreadsheet using Visual Basic for Applications as
programming language. During the course of the development, the macros have been
"migrated" into a Java code base. From there it was later "transformed" into
TypeScript. It is safe to say objectively that this has left its mark on the
code quality. Despite heavy work and refactoring, the origins are still visible.

Having to describe the code structure from the current point of view, its still
relatively messy. Though, more and more structure is forming. In its base, the
package defines some data models it operates on. The rest are a bunch of
functions implementing various parts of the algorithm, creating a complex
call-tree. While being quite functional, the data is not fully immutable yet.

With continuous work on, more helpful documentation should be provided.
