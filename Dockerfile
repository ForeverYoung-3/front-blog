# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
# 先复制依赖文件，利用缓存层
COPY package.json package-lock.json ./
RUN npm ci
# 复制源码构建
COPY . .
# 构建时注入后端 API 地址（由 docker-compose 或 CI 传入）
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# ---- Run Stage ----
FROM nginx:1.25-alpine
# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html
# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
