# Gunakan Node.js versi LTS sebagai base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Tambahkan pustaka sistem yang diperlukan untuk Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libcups2 \
    libpangocairo-1.0-0 \
    libxdamage1 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libasound2 \
    libgbm1 \
    libxshmfence1 \
    && rm -rf /var/lib/apt/lists/*

# Copy seluruh file proyek ke dalam container
COPY . .

# Expose port untuk container
EXPOSE 3000

# Jalankan server
CMD ["npm", "run", "dev"]
