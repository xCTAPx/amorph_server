FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production --loglevel verbose

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Запускаем приложение
CMD ["npm", "run", "start:prod"]

EXPOSE 3000