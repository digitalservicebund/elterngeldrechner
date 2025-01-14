# Use the official Node.js 20 base image for development containers
FROM mcr.microsoft.com/devcontainers/base:alpine

# Use the pinned node version
ARG EXTRA_NODE_VERSION=20.11.1
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"