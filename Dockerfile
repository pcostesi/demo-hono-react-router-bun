# syntax=docker/dockerfile:1.4

ARG APP=my-app
ARG BUN_VERSION=1.2.2

FROM oven/bun:${BUN_VERSION}-alpine as bun-alpine
WORKDIR /app
RUN apk update && apk add --no-cache libc6-compat tini
ENV APP=${APP}

# ============= Install Development Dependencies =============

FROM bun-alpine AS development-dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ============= Install Production Dependencies =============

FROM bun-alpine AS production-dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ============= Devcontainer (for local development) =============

FROM bun-alpine AS devcontainer
WORKDIR /app
COPY . .
COPY --from=development-dependencies /app/node_modules /app/node_modules
EXPOSE 5173/tcp
CMD ["bun", "run", "dev"]

# ============= Build the Application =============

FROM bun-alpine AS build
COPY . .
COPY --from=development-dependencies /app/node_modules /app/node_modules
RUN bun run build

# ============= Final Release Image =============

FROM bun-alpine AS release
WORKDIR /app
USER bun

# Copy only necessary runtime files
COPY package.json bun.lock ./
COPY --from=production-dependencies /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build

EXPOSE 3000/tcp

ENTRYPOINT [ "/sbin/tini", "--" ]
CMD ["bun", "run", "start"]
