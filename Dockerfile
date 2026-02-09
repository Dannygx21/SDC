# =========================
# Catwalk Backend (API + ETL)
# =========================

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only dependency manifests first (better caching)
COPY package*.json ./

# Install production dependencies deterministically
RUN npm ci --omit=dev

# Copy application source
COPY src ./src

# Expose API port (internal only)
EXPOSE 4000

# Default command: run API
CMD ["npm", "start"]
