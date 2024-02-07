# Contributing to this Project

Hello and welcome to the EGR (ElternGeldRechner) App. This repository will provide the API, UI and web-component files for this application.
We want to distribute the following functionality in this package:

1. EGR Calculations API
2. EGR-Web-Component
3. EGR-Freemarker-Macro (?)

## Collaborating
### We want to share our code
Therefor we will review the code we want to merge.\
Every Merge Request has at least one different person as Reviewer.\
The Reviewer will **NOT** merge, but review the changes, understand the changes and summarize the changes into one single comment *below* the Merge Request.\
We can do this review on a pair-programming base, but will document all discussed findings.

Only Maintainer are allowed to merge, but every Developer is allowed to review!

### Our common language is english
Therefor our code-documentation will be in english.\
Exception are allowed on technical domain to keep consistence for the domain.

## Committing
### We want to document our changes
Therefor we want to commit our changes in a clean format:

```bash
[ISSUE-ID] what this commit does
```
For example:

```bash
[EGR-1234] adds contribution guide lines
```

Sometimes, we have changes, that are not issue related. In these cases, we document this as well:

```bash
[no issue] what this commit does
```
For example:
```bash
[no issue] updates vulnarable dependency after npm audit fix
```

### We want to keep our changes easy to understand
In a commit we therefore want to keep two things as small as possible:
1.  the number of changed files
2.  the amount of changes in a file

Committing changes on over 10 files is sometimes necessary, but should not be the default use case.\
So keep your commits small, but effective!

A good indicator, that you did everything nicely, is when you have more commits than changes on your merge request!

## Developing
### We want to keep our code clean
Therefor we do not disable linter rules. Linter rules are configured to keep all code contributed to this repository readable and maintainable.\
If you really need to disable a rule, ask for permission to do so. Document whom you talked to.\
Still, we don't want to use `stylelint-disable` or `eslint-disable`, because we want to avoid disabling rules for following files. Instead rather use `stylelint-disable-line` or `eslint-disable-next-line`.

```scss
.hide-on-print {
  display: none !important; /*stylelint-disable-line declaration-no-important */ // granted by kroth
}
```

```js
 //...
    /* eslint-disable-next-line no-regex-spaces */ // granted by lheisinger
    const re = /test   content/;
 //...
```

#### Javascript
We want to use `data-js-`-attributes as selector for our javascript components, when they are necessary.\
We place configurations for a javascript component into this `data-js-`-attribute as a JSON-String.\
We don't want to shorten our variable names. The configured minifier does this for us.

```html
<div data-js-my-component='{"settingA": "A", "settingB":"B"}'></div>
```

```javascript
const $myComponent = $("[data-js-my-component]");
const myComponentConfiguration = $myComponent.data();
```

#### Scss
We want to use sass modules for our components.\
We want to use `#{nsp("block")}` as prefix for our BEM organized css classes.\
We want to use  this pattern for variable naming: `[component-block][__component-element|--modfier][--state]--[shortend-css-attribute]--(viewport)`\
We want to use the `Mobile-First`-Concept to style our components.\

```scss
// my-component.variables.scss
@forward "src/globals/scss";
@use "src/globals/scss" as egr;

$my-component--fs: egr.$base-font-size;
$my-component--small--fs: egr.$font-size--sm;
$my-component__heading--fs: egr.$heading--fs;
$my-component__heading--hover--fs: egr.$heading--fs;
...

```

```scss
// my-component.scss
@use "my-component.variables" as *;

.#{$nsp}my-component {
  font-size: rem($my-component--fs);
  // probably better: rem($ed-my-component--fs--sm)
  
  &--small {
    font-size: rem($my-component--small--fs);
  }

  &__heading {
    font-size: rem($my-component__heading--fs);
    
    &:hover {
        font-size: rem($my-component__heading--hover--fs);
    }

    @include media-breakpoint-up(lg) {
      font-size: rem($my-component__heading--fs--lg);
    }
  }
}
```

### We want our components to be easy to customize
Therefor we use the [`!default` parameter](https://sass-lang.com/documentation/variables#default-values) for variable definitions in our components `settings.scss`. This way the settings can easily be overridden by theme configurations in `src/applications/{theme}/settings.scss`.\
Also we provide customizable variables through `data-js-`-attributes for javascript components.


### We want to document our components
There for we add new components with the following structure:

```bash
my-new-component
|- my-new-component.variables.scss: (*) will provide all scss variables
|- my-new-component.scss: (*) this is the css for this component
|- index.scss (*) sass-modules forwarding for this component
|- MyNewComponent.ts: this is the javascript/typescript for this component
|- MyNewComponent.d.ts: this file is for type definitions
|- MyNewComponent.tsx: (*)
|- index.ts (*) forwarding for the React Component and types
|- Readme.md (*)
```
Files marked with `(*)` are optional.\
Now you probably want to know what a README-file contains?

```md
# My New Component
What is this component for? 
Why did we implemented it? 
What should it be used for?

# Usage

Add best use case example here. Also add the output, which is expected to be rendered.

# Params

**MyNewComponent**
|AttributeName|Default|Description        |
|-------------|:-----:|-------------------|
|myAttribute  | *     | Modifies something|

`*` marks required Parameters.
```
## Commitment

[x] I, *apetrakow*, have read, understood and commit myself to these rules.

[x] I, *slooschen*, have read, understood and commit myself to these rules.

[x] I, *kroth*, have read, understood and commit myself to these rules.

[x] I, *nmeyer*, have read, understood and commit myself to these rules.

[x] I, *mflohr*, have read, understood and commit myself to these rules.

[x] I, *twestphal*, have read, understood and commit myself to these rules.

[] I, *user*, have read, understood and commit myself to these rules.
