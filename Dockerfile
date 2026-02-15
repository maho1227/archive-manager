FROM php:8.4-fpm

# 必要なパッケージ
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip

# Composer をコピー
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ
WORKDIR /var/www/html

# プロジェクトファイルをコピー
COPY . .

# Composer install（本番用）
RUN composer install --no-dev --optimize-autoloader

# Inertia + React 用：Vite ビルド
RUN npm ci
RUN npm run build

# migration → サーバー起動（Release Command 相当）
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}"]
