# Use the latest LTS version of Node.js as the base image
FROM node:lts

# Set the working directory to /src
WORKDIR /src

# Copy all files from the root folder to /src in the container
COPY . .

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Expose the port the app runs on (optional, adjust as needed)
# EXPOSE 3000

# Command to run the application (optional, adjust as needed)
CMD ["npm", "start"]