# Stage 1: Build the Expo Web App
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
# Use npm ci when possible; fall back to legacy peer dep resolution if needed
RUN npm ci --no-audit --prefer-offline || npm install --no-audit --prefer-offline --legacy-peer-deps

# Copy all project files
COPY . .

# Build for production (Expo static export)
# Allow selecting environment at build time (dev|test|prod)
ARG APP_ENV=prod
ENV EXPO_PUBLIC_ENV=$APP_ENV
# Cap build memory so the export fits a resource-tight Docker VM (~4 GB). Metro
# spawns one worker process per CPU by default; on a many-core host mapped into a
# small VM the combined heap OOM-kills buildkit mid-export (the connection drops
# as `rpc error: Unavailable ... EOF`), which took down Docker Desktop entirely
# on 2026-07-05. `--max-workers 2` + a per-process heap cap keeps peak RAM bounded
# (slower, but reliable). Raise on a box with more RAM if build time matters.
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN echo "Building Erevna Web for ENV=$EXPO_PUBLIC_ENV" && npx expo export --platform web --max-workers 2

# Inject the Umami analytics tag into every exported HTML page.
# Expo's static export strips <script> elements from app/+html.tsx, so the
# tag is added here as a post-export step instead.
RUN find dist -name '*.html' -exec sed -i 's#</head>#<script defer src="https://analytics.dloizides.com/script.js" data-website-id="2ecad02e-fd6e-4ded-9c2c-47ff8e0b6a4b"></script></head>#' {} +

# Inject SEO meta (Open Graph / Twitter / canonical) — Expo's static export
# strips these from app/+html.tsx, same as it strips <script>.
RUN find dist -name '*.html' -exec sed -i 's#</head>#<meta property="og:title" content="Erevna - From wondering to knowing"><meta property="og:description" content="Build forms, surveys, and quizzes your audience actually wants to fill out, and turn what they say into decisions you can act on."><meta property="og:type" content="website"><meta property="og:url" content="https://erevna.dloizides.com"><meta property="og:image" content="https://erevna.dloizides.com/icons/logo-512.png"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Erevna - From wondering to knowing"><meta name="twitter:description" content="Build forms, surveys, and quizzes your audience actually wants to fill out."><link rel="canonical" href="https://erevna.dloizides.com"><meta name="robots" content="index, follow">#' {} +

# Self-heal returning users stuck on an immutable-cached OLD entry bundle (task
# #257). Expo keeps the bootstrap bundle filenames (entry-/__expo-metro-runtime-/
# __common-) STABLE across builds, so a browser that cached them `immutable` in
# the past keeps serving a stale chunk map → 404 on deleted route chunks → blank
# app, with no self-service recovery (hard-refresh can't evict `immutable`). This
# appends a content-hash `?v=` to those three script refs in the exported HTML:
# index.html is served no-cache, so the next visit points at a URL the stale
# immutable cache can't match → forced fresh fetch → working app, zero user action.
RUN node scripts/append-bundle-cache-buster.mjs dist

# Stage 2: Serve with Nginx
FROM nginx:alpine AS production
LABEL org.opencontainers.image.authors="dloizides.com"
LABEL org.opencontainers.image.vendor="dloizides.com"
LABEL org.opencontainers.image.title="Erevna"
LABEL built-by="dloizides.com"

# Copy built static files (Expo exports to /app/dist)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration (optional, if exists)
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
