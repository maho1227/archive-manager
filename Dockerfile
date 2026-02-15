FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Composer install
RUN composer install --no-dev --optimize-autoloader

# Vite build
RUN npm install
RUN npm run build

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT}"]
