FROM node:22-alpine

WORKDIR /app

# Cài dependencies trước (tận dụng layer cache)
COPY package*.json ./
RUN npm install --omit=dev

# Copy toàn bộ source code
COPY . .

EXPOSE 3000

CMD ["node", "src/server.js"]
