# Multi-stage build: compile the SPA with Node, serve static with nginx.
# The hub has no backend of its own — nginx just serves the built HTML/JS/CSS.
# Auth POSTs go to /regalgrid/api/* which the outer Caddy proxies to one of
# the app APIs (they share auth via AUTH_DATABASE_URL).

FROM node:20-alpine AS build
WORKDIR /app

# VITE_BASE is baked into every asset URL at build time. Set to /regalgrid/
# when serving under that path on a parent domain.
ARG VITE_BASE=/
ENV VITE_BASE=$VITE_BASE

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/regalgrid-hub.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=4s --start-period=10s --retries=3 \
    CMD wget -q --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
