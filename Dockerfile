# Note when updating this version also update the version in the workflow files
FROM node:16.17.1 AS builder

ARG BASE_HREF=/

WORKDIR /app

COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install

COPY . /app

# Disabled for now because of runtime -- GitHub Actions job runs tests in parallel
#RUN npm run test

RUN npm run build -- --base-href=${BASE_HREF}

FROM nginx:1.23.1-alpine

ARG VERSION_TAG=snapshot

LABEL org.opencontainers.image.authors="support@b3partners.nl" \
      org.opencontainers.image.description="Tailormap Viewer provides the web interface for Tailormap" \
      org.opencontainers.image.vendor="B3Partners BV" \
      org.opencontainers.image.title="Tailormap Viewer" \
      org.opencontainers.image.url="https://github.com/B3Partners/tailormap-viewer/" \
      org.opencontainers.image.source="https://github.com/B3Partners/tailormap-viewer/" \
      org.opencontainers.image.documentation="https://github.com/B3Partners/tailormap-viewer/" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION_TAG}"

COPY --from=builder /app/dist/app /usr/share/nginx/html

COPY docker/web/nginx.conf /etc/nginx/nginx.conf
COPY docker/web/api-proxy.conf.template /etc/nginx/templates/api-proxy.conf.template
COPY docker/web/admin-proxy.conf.template /etc/nginx/templates/admin-proxy.conf.template
COPY docker/web/enable-proxies.sh /docker-entrypoint.d/enable-proxies.sh
COPY docker/web/configure-sentry.sh /docker-entrypoint.d/99-configure-sentry.sh

EXPOSE 80

# NO USER command; nginx drops to nginx user for worker processes

HEALTHCHECK --interval=30s --timeout=3s --retries=2 CMD wget --spider --header 'Accept: text/html' http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
