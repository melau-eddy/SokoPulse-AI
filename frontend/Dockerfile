FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Run local development server binding to host interface
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
