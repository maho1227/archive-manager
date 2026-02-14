FROM php:8.2-fpm

# 必要パッケージ
RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# プロジェクトファイルをコピー
COPY . .

# Composer install
RUN composer install --no-dev --optimize-autoloader

# Laravel キャッシュ
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Render が渡す PORT を使って起動
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT}"]
