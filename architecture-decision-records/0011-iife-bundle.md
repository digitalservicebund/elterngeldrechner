# 11. IIFE Bundle

Date: 2026-06-16

## Status

Accepted by Engineering (Dennis)

Amends [0005](0005-bundle-architecture.md).

## Context

The Content-Management-System embeds the app via the `<script>` tag without
setting `defer="false"` or `type="module"`. We know that module loading is a
limitation of the CMS. Unfortunately that means we share a scope with other
scripts and can produce clashes of symbol definitions.

We have experienced every now and then that the released bundle broke on
staging and production but not on preview. The difference was that on preview
the app was loaded as a module (`type="module"`) and therefore had its own
encapsulated scope. However on staging and production it shared its scope
with, for example, the Familienportal Theme (`fpo.js`). Concretely both defined
a top-level `L`; whichever loaded last won, and the app then called the wrong
one (`TypeError: L is not a function`).

## Decision

Build the bundle as an IIFE (`output.format: "iife"`). A function scope keeps
every top-level binding private, so we neither leak into nor clash with the
shared scope regardless of load order or minified names.

The single IIFE chunk also makes Vite inline the CSS into the JS, so the
artifact is one JS file and no CSS file.

In order to further align the preview and staging environment the vite hook
`transformIndexHtml` is used to drop the `type="module"` from the generated
bundle. The hook is skipped during `vite serve` because it needs ESM/HMR.

## Consequences

The app is now robust against scope clashes however it is embedded, preview
reproduces the production load path, and the bundle is ~1.8 MB.

The CMS still links the old `index.css` which we must remove after releasing
this change.

Minification is turned on again with the default options set as it wasn't the
root cause.
