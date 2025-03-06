# Monatsplaner

This "package" contains the domain logic to plan the months for _Elternzeit_.

To apply for _Elterngeld_, it is mandatory to create a _Plan_. For such
a _Plan_, each _Elternteil_ can choose for each _Lebensmonat_ a _Variante_ of
_Elterngeld_. Moreover, _Elternteile_ can have an income for each _Lebensmonat_.
The _Auswahlmöglichkeiten_ are limited by an available _Kontingent_ and the
rules, depending on the individual _Ausgangslage_. Depending on the made choices
and inputs, the calculated _Elterngeld_ will vary for each _Monat_ per
_Elternteil_.

## Technical Details

The implementation orientate itself on a Domain-Driven-Design approach in
a functional style. In the context of the latter, and without any integration
for domain services or external layers, all data models are immutable. In
result, the domain consists solely of object values without any entities. This
functional style plays nicely with the functional reactive programming of the
currently only application using it.

As the real-world domain is a German one, the implementation makes heavy use of
the German language. Low level or pure technical parts are using English. The
same concept goes for documentation where clean code needs some.
It is obligatory to acquire domain knowledge before interacting with the domain.
Though, the tests often use behavior-driven-design language to describe the
tested behavior.

Using a functional inspired implementation, all use-cases to read or write data
are represented as pure functions. These are grouped as `operations` according
to their primary object value they act on.

Furthermore, the domain makes heavy use of the specification design pattern. It
is used for in-memory validation, as well as query mechanisms. The domain
includes its own strong implementation of this design pattern. Specifications
are generic over their instance type they evaluate. Thereby, they are grouped
according to the object values they specify.

In combination, a typical directory structure of an object value called
`MyObjectValue` looks like this:

```
─ my-object-value
  ├─ operation
  │  ├─ operation-a.ts
  │  ├─ operation-b.ts
  │  └─ index.ts
  │
  ├─ specification
  │  ├─ specification-a.ts
  │  ├─ specification-b.ts
  │  └─ index.ts
  │
  ├─ MyObjectValue.ts
  └─ index.ts
```

The modules make heavily use of re-exports to disguise the internal structure
and keep short and easily maintainable import statements.

There is no direct dependency on a calculator for _Elterngeld_ on purpose.
Having dependency inversion/injection allows for higher independence and
maintainability.

Moreover, the domain tries to use strong type-driven-development where possible.
For example it makes strong use of generics for how many _Elternteile_ are
involved. Unfortunately, there are some limitations of programming languages. In
consequence some code is more verbose or type-insecure than it could be.
