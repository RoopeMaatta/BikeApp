# Use the Node.js 19 image from Docker Hub
FROM node:19

# Set the working directory
WORKDIR /app

# Install Git LFS
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git-lfs && \
    git lfs install

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your application code
COPY .. .

# Pull the LFS files
RUN git lfs pull

# Set environment variables
ENV port=3000

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD [ "npm", "start" ]
