# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16.14.0-alpine 

ARG REACT_APP_BACKEND_URL

# Set the working directory to /app inside the container
RUN mkdir /app
ADD . /app
WORKDIR /app
# Copy app files
COPY . .
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm i 
# Build the app
RUN npm run build -o weather-frontend-react
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production`
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
CMD [ "npm", "run", "start" ]