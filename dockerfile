# Use the official Ubuntu base image
FROM ubuntu:latest

# Update package list
RUN apt-get update

# Install curl and gnupg which are required for adding the Node.js repository
RUN apt-get install -y curl gnupg

# Add the Node.js repository
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -

# Install Node.js and adb
RUN apt-get install -y nodejs adb

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
