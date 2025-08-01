# 1. External Link Checking

Date: 2025-07-25

## Status

Accepted by Engineering (Dennis, Jakob)

## Context

The project initially included a simple GitHub action that identifies all links within
the repository and uses curl to verify whether they are still valid and accessible.

This action, however, has some limitations. It was missing a couple of links after adding
a new feature next to the application directory, does pick up links we don't want to
validate like xml namespaces of svgs and more critically does have false positives
on a regular basis because the web servers start blocking calls from the github
infrastructure.

We are not sure yet how the servers decide which requests to block but we verified it
by testing to reach the domain lvwa.sachsen-anhalt.de from localhost which worked, from
a github codespace which did not work, from a github action which did not work as well
and from a github action that uses a developer machine as runner which did work.

## First Iteration

In a first iteration we decided to introduce an ignore list that includes both domains
which actively block github infrastructure as well as those which should not be checked
despite being matched by the grep pattern, like xml namespaces.

The solution seemed promising as it struck a reasonable balance between time invested
and output. Therefore we opted against a more sophisticated parsing approach as well
as against including additional infrastructure like a custom github runner hosted in
our platform to tackle the blocked request problem.

## Last Iteration

Unfortunately the github action kept failing with false positives on a daily basis and
caused noise in the slack channel while also adding tasks on top of the engineers' to-do
lists.

In order to reduce the number of false positives and code complexity (the action became
quite complex at this point), we shifted the check left towards a pre-commit hook that
uses the tool Lychee. The tool runs within 3-4 seconds, is easy to configure while also
reducing the number of false positives because requests are coming from our local machines.

## Consequences

The consequence of shifting left with the link checking is that, if no engineer
is working, no links are getting checked. However if no engineer is available
to code, they are probably on vacation and cannot fix broken links anyway.

Additionally, it can be a bit cumbersome for the workflow if the pre-commit
hook fails: the developer might have to stash their changes, fix the link
first, and then apply the changes again.
