# 1. PHP + 必要拡張
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ
WORKDIR /var/www/html

# プロジェクトファイルをコピー
COPY . .

# Composer install
RUN composer install --no-dev --optimize-autoloader

# Laravel キャッシュ最適化
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# 2. Web サーバーとして PHP のビルトインサーバーを使用
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
