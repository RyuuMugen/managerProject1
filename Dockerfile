# Use an official Node runtime as a parent image
FROM node:18.19-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock /app/

# Install dependencies
RUN yarn install

# Copy the remaining application files to the working directory
COPY . /app/

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the application
CMD ["yarn", "start"]
