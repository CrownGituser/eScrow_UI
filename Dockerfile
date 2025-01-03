# Stage 1: Build the Angular application
FROM node:16 as build-stage

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the source code to the container
COPY . .

# Build the Angular application
RUN npm run build --prod

# # Stage 2: Serve the application using Nginx
# FROM nginx:alpine as production-stage

# # Copy the built application from the build stage
# COPY --from=build-stage /app/dist/escrow /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx server
# CMD ["nginx", "-g", "daemon off;"]
