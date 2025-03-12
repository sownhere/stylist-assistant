FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose API port
EXPOSE 3001

# Start the app
CMD ["npm", "start"]
