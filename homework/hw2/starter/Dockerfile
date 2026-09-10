# The test tools for Homework 2: PHPUnit and Playwright, in ONE image.
#
# The first lines are byte-for-byte the same as the week-3 Pantry Dockerfile,
# on purpose: Docker caches image layers by their instructions, so on a machine
# that built Pantry these layers are reused and nothing new is downloaded. (Yes,
# that means Apache is installed in here and never used. It costs nothing.)
FROM mcr.microsoft.com/playwright:v1.62.1-noble

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      apache2 libapache2-mod-php8.3 \
      php8.3-cli php8.3-sqlite3 php8.3-xml php8.3-mbstring php8.3-curl unzip \
 && rm -rf /var/lib/apt/lists/*

# Composer is PHP's npm. Copy the binary straight out of its official image.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# PHPUnit (composer) and Playwright's runner (npm), installed into the image so
# no test run downloads anything.
COPY composer.json phpunit.xml package.json playwright.config.js ./
RUN composer install --no-interaction --no-progress \
 && npm install --silent
