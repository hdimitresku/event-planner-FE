# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Enable and install pnpm
RUN corepack enable && corepack prepare pnpm@10.8.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Accept build-time environment variables
ARG VITE_API_URL
ARG VITE_API_IMAGE_URL
ARG VITE_APP_ENV
ARG VITE_APP_NAME

# Inject env variables into build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_IMAGE_URL=$VITE_API_IMAGE_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_APP_NAME=$VITE_APP_NAME

# Build Vite frontend
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
