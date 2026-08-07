# The base image every job of the GitLab pipeline runs in.
#
# It holds only what has to exist before `mise install` can take over: mise
# itself, plus the git and TLS trust the runner needs to clone. Everything
# else is pinned in mise.lock and installed per job, so a dependency bump
# never requires rebuilding this image.
#
# mise is fetched by digest, not by version string: the version says what was
# asked for, the checksum says what arrived. Update them together, see the
# README next to this file.

ARG DEBIAN_DIGEST=sha256:abd67ffcfa541b485a3dff59865ab629aa048a6c613e639d36e7456b0b229241

# --- builder ---------------------------------------------------------------
# Downloading needs curl, and none of it is shipped: only the verified binary
# crosses into the runtime stage.

FROM debian:bookworm-slim@${DEBIAN_DIGEST} AS builder

ARG MISE_VERSION=2026.8.0
ARG MISE_SHA256=64183603854f319b78658305c545aacae935e0959a3a894b77a0f9416eab047b

RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /out

RUN curl --fail --silent --show-error --location \
      --proto '=https' --proto-redir '=https' --tlsv1.2 \
      --output mise.tar.gz \
      "https://github.com/jdx/mise/releases/download/v${MISE_VERSION}/mise-v${MISE_VERSION}-linux-x64.tar.gz" \
    && printf '%s  mise.tar.gz\n' "${MISE_SHA256}" | sha256sum --check --strict - \
    && tar --extract --gzip --file mise.tar.gz --strip-components=2 mise/bin/mise \
    && rm mise.tar.gz \
    && chmod 0755 mise

# --- runtime ---------------------------------------------------------------

FROM debian:bookworm-slim@${DEBIAN_DIGEST}

LABEL org.opencontainers.image.title="elterngeldrechner-ci"
LABEL org.opencontainers.image.description="CI base image: mise and nothing else"
LABEL org.opencontainers.image.source="https://gitlab.opencode.de/digitalservicebund/elterngeldrechner"
LABEL org.opencontainers.image.licenses="EUPL-1.2"

# git so the runner can clone, ca-certificates so every https fetch mise makes
# is verified. No curl, no archive tools: whatever this image cannot download,
# a compromised job cannot download either.
RUN apt-get update \
    && apt-get install --yes --no-install-recommends ca-certificates git \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --uid 1000 --shell /bin/sh ci

# Not writable by the user that runs the job, so nothing in a pipeline can
# replace the binary that installs and verifies the rest of the toolchain.
COPY --from=builder --chown=root:root /out/mise /usr/local/bin/mise

USER ci
ENV HOME=/home/ci
