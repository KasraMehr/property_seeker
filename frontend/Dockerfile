# Stage 1: Build the React application
FROM node:20-alpine AS builder

# تنظیم میرور ایران برای پکیج‌های سیستم‌عامل Alpine
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.arvancloud.ir/g' /etc/apk/repositories

WORKDIR /app

# کپی کردن فایل‌های پکیج برای نصب وابستگی‌ها
COPY package*.json ./

# نصب وابستگی‌ها از رجیستری اصلی npm
RUN npm install \
      --registry=https://registry.npmjs.org \
      --fetch-timeout=120000 \
      --fetch-retries=5 \
      --no-audit \
      --no-fund

# کپی کردن کل کدهای فرانت‌اند و گرفتن Build
COPY . .
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:stable-alpine

# تنظیم میرور آلپاین برای استیج نهایی
RUN sed -i 's/dl-cdn.alpinelinux.org/mirror.arvancloud.ir/g' /etc/apk/repositories

# کپی کردن خروجی مرحله قبل به پوشه پیش‌فرض Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی کردن کانفیگ اختصاصی Nginx برای مدیریت مسیرها
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
