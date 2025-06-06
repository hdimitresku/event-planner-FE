# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files (including .env.production)
COPY . .

# Use .env.production for vite build
RUN cp .env.production .env && pnpm build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
