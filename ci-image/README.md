# Gitlab Pipeline Base Image

Since we provision our tools using `mise`, and `setup-mise` from the GitLab
infrastructure team is not available on Open CoDE, we had to come up with our
own image containing a pinned version of `mise`.

## Bumping mise

Grep the checksum from the new release and change it together with the mise
version in the [Dockerfile](Dockerfile).

```sh
MISE_VERSION=2026.8.0

curl -fsSL https://github.com/jdx/mise/releases/download/v${MISE_VERSION}/SHASUMS256.txt \
  | grep linux-x64.tar.gz
```

## Building the image

Build from the repository root and tag the image with the mise version it
carries, never `latest`: the pipeline pins the image by digest, and a moving
tag would let two runs of the same commit build in different environments.

```sh
docker build --platform linux/amd64 \
  --build-arg DEBIAN_DIGEST=sha256:362e64223cc0da95422b3b13c045186fc0a81250e765d31c025fbddf257f6143 \
  --tag elterngeldrechner-ci:2026.8.0 \
  ci-image
```

## Gitlab registry authentication

Create a personal access token scoped to `read_registry` and `write_registry`
only and write it to `pat.txt` next to the docker commands. Passing it on stdin
keeps it out of the shell history and the process list, deleting the file right
after keeps it out of everything else.

```sh
touch pat.txt && vim pat.txt

docker login registry.opencode.de \
  --username <gitlab-username> \
  --password-stdin < pat.txt

rm pat.txt
```

## Pushing the image

Retag the image under the registry path and push to the registry.

```sh
docker tag elterngeldrechner-ci:2026.8.0 \
  registry.opencode.de/digitalservicebund/elterngeldrechner/ci:2026.8.0

docker push registry.opencode.de/digitalservicebund/elterngeldrechner/ci:2026.8.0
```

## Updating the pipeline

Take the digest the registry assigns from the user interface and change it
together with the tag in [.gitlab-ci.yml](../.gitlab-ci.yml), so the next run
picks up the new image.
