FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies, including devDependencies
RUN npm install

# Copy the rest of the application source code
# This is useful so the container can run without a volume if needed
COPY . .

# Expose the Vite port
EXPOSE 5173

# The default command to run the dev server
CMD ["npm", "run", "dev"]
