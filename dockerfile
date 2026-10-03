# Step 1: Base Image
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Step 2: Install dependencies
FROM base AS install
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Step 3: Build SvelteKit app
FROM base AS builder
COPY --from=install /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
RUN bun run build

# Step 4: Production Runner
FROM base AS release
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000
CMD ["bun", "./build/index.js"]