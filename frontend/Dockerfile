FROM node:20-alpine AS builder

SHELL ["/bin/sh", "-euxo", "pipefail", "-c"]

RUN echo "STEP 1: builder started" && date

WORKDIR /app
RUN echo "STEP 2: workdir set" && date

COPY package*.json ./
RUN echo "STEP 3: package files copied" && ls -lah /app

RUN echo "STEP 4: npm ping start" \
    && npm ping --registry=https://registry.npmjs.org \
    && echo "STEP 4: npm ping done"

RUN echo "STEP 5: npm install start" \
    && npm install \
      --registry=https://registry.npmjs.org \
      --fetch-timeout=120000 \
      --fetch-retries=5 \
      --no-audit \
      --no-fund \
      --loglevel=verbose \
    && echo "STEP 5: npm install done"

COPY . .
RUN echo "STEP 6: source copied" && ls -lah /app

RUN echo "STEP 7: npm build start" \
    && npm run build \
    && echo "STEP 7: npm build done"

FROM nginx:stable-alpine

SHELL ["/bin/sh", "-euxo", "pipefail", "-c"]

RUN echo "STEP 8: nginx stage started" && date

COPY --from=builder /app/dist /usr/share/nginx/html
RUN echo "STEP 9: dist copied"

COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN echo "STEP 10: nginx.conf copied"

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
