# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and env files
COPY . .

# Build the application with environment variables
ARG VITE_API_URL
ARG VITE_APP_ENV
ARG VITE_APP_NAME
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_NAME=$VITE_APP_NAME

RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh\n\
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp\n\
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh \
&& chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Start Nginx with environment variable replacement
CMD ["/docker-entrypoint.sh"] 