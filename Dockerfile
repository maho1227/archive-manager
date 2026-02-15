FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

# ★ キャッシュ系コマンドは絶対に入れない（Render では逆効果）

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT}"]