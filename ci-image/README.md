# CI base image

The image every job of `.gitlab-ci.yml` runs in, published to the project's
container registry on Open CoDE.

It contains mise, git and the CA trust store — nothing else. The whole
toolchain, including the 1Password CLI that fnox shells out to, is pinned in
`mise.lock` and installed per job by `mise install`, so bumping a tool never
touches this image. Expect to rebuild it only when mise itself moves, roughly
twice a year.

Building at all is a deliberate choice over pulling a public image: at pipeline
time the only registry involved is the one ZenDIS operates, which is the point
of the migration.

## Bumping mise

Both digests are `ARG` defaults in the `Dockerfile` and are verified during the
build, so a wrong value fails the build rather than shipping silently. A commit
that changes a version therefore also carries the checksum that proves it.

```sh
# The base image. crane returns the manifest-list digest, which is the one to
# pin: an amd64 runner cannot resolve a digest that names the arm64 manifest.
mise x crane -- crane digest debian:bookworm-slim

# mise. Cross-check against SHASUMS256.txt on the same release.
curl -fsSL https://github.com/jdx/mise/releases/download/v${VERSION}/SHASUMS256.txt \
  | grep linux-x64.tar.gz
```

## Building and pushing

The image is built in CI rather than on a laptop. The Open CoDE runners are
x86 and every developer machine here is arm64, so a local build would go
through emulation for an image that then runs in every job. There is no
chicken-and-egg problem: this job runs in Buildah's own public image, not in
the image it produces.

```yaml
build-ci-image:
  stage: build
  image: quay.io/buildah/stable@sha256:…
  variables:
    STORAGE_DRIVER: vfs
    BUILDAH_ISOLATION: chroot
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      changes: [ci-image/Dockerfile]
      when: manual
  script:
    - buildah login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - buildah build --tag "$CI_REGISTRY_IMAGE/ci:$MISE_VERSION" ci-image
    - buildah push "$CI_REGISTRY_IMAGE/ci:$MISE_VERSION"
```

`when: manual` because rebuilding the image is a side effect, and while GitHub
is still the source of truth every side effect belongs to exactly one pipeline.

Tag with the mise version the image carries, never `latest`: `.gitlab-ci.yml`
pins the image by digest, and a moving tag would let two runs of the same
commit build in two different environments.

```sh
mise x crane -- crane digest \
  registry.opencode.de/digitalservicebund/elterngeldrechner/ci:2026.8.0
```

The digest goes into `.gitlab-ci.yml`, where it, and not the tag, decides what
every job runs in:

```yaml
default:
  image: registry.opencode.de/digitalservicebund/elterngeldrechner/ci:2026.8.0@sha256:38f5364dfbb4f1de3b1bac70b1bd7352a7656b68a2f91697938cb79d20966aa6
```

## Scanning

The image is held to the same bar as the working tree, so scan it with the
trivy that `mise run audit-vulnerabilities` already pins, as a step of the job
above and before the push:

```sh
trivy image --severity HIGH,CRITICAL --exit-code 1 "$CI_REGISTRY_IMAGE/ci:$MISE_VERSION"
```

A base image that fails the scan makes every job's audit meaningless.
