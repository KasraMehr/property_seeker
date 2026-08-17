# Stage 1: Build the React application
FROM node:20-alpine AS builder

RUN echo "===> [builder] Starting stage 1: node:20-alpine" \
    && sed -i 's/dl-cdn.alpinelinux.org/mirror.arvancloud.ir/g' /etc/apk/repositories \
    && echo "===> [builder] Alpine repositories changed to Arvan mirror"

WORKDIR /app
RUN echo "===> [builder] Working directory set to /app"

# فقط فایل‌های وابستگی را اول کپی می‌کنیم تا cache بهتر عمل کند
COPY package*.json ./
RUN echo "===> [builder] package*.json copied"

# نصب وابستگی‌ها
RUN echo "===> [builder] npm install started" \
    && npm install \
      --registry=https://registry.npmjs.org \
      --fetch-timeout=120000 \
      --fetch-retries=5 \
      --no-audit \
      --no-fund \
    && echo "===> [builder] npm install finished successfully"

# کپی کردن کل سورس
COPY . .
RUN echo "===> [builder] source code copied"

# build
RUN echo "===> [builder] npm run build started" \
    && npm run build \
    && echo "===> [builder] npm run build finished successfully"

# Stage 2: Serve the React application using Nginx
FROM nginx:stable-alpine

RUN echo "===> [nginx] Starting stage 2: nginx:stable-alpine" \
    && sed -i 's/dl-cdn.alpinelinux.org/mirror.arvancloud.ir/g' /etc/apk/repositories \
    && echo "===> [nginx] Alpine repositories changed to Arvan mirror"

# کپی کردن خروجی مرحله قبل
RUN echo "===> [nginx] preparing to copy built files"
COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo "===> [nginx] build files copied to nginx html directory"

# کپی کردن کانفیگ
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN echo "===> [nginx] nginx.conf copied"

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
