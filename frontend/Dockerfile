# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# کپی کردن فایل‌های پکیج برای نصب وابستگی‌ها
COPY package*.json ./
RUN npm install

# کپی کردن کل کدهای فرانت‌اند و گرفتن Build
COPY . .
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:stable-alpine

# کپی کردن خروجی مرحله قبل به پوشه پیش‌فرض Nginx
# (اگر از Vite استفاده می‌کنید dist و اگر از Create React App استفاده می‌کنید build بسازید)
COPY --from=builder /app/dist /usr/share/nginx/html

# کپی کردن کانفیگ اختصاصی Nginx برای مدیریت مسیرها (Routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]