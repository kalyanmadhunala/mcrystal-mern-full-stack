# Official Playwright Docker image (includes Node.js v22 LTS, browsers, and all dependencies)
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install production dependencies only (smaller image)
RUN npm ci --omit=dev

# Copy the rest of your app code
COPY . .

# If your project has a separate frontend (e.g., React in a 'client' folder) and needs building:
# Uncomment the lines below and adjust paths if needed
# RUN cd client && npm ci && npm run build

# Expose port (Render will override with $PORT)
EXPOSE 10000

# Start your backend server
CMD ["node", "server.js"]