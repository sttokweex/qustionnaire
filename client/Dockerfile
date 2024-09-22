# Используем официальный образ Node.js в качестве базового
FROM node:16

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы приложения
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем сервер для обслуживания статических файлов
FROM nginx:alpine

# Копируем собранные файлы в директорию Nginx
COPY --from=0 /app/dist /usr/share/nginx/html

# Экспонируем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
