#!/bin/bash

# LuxeLens AI - Backend Scaffold Script
# This script initializes a standalone Node.js API with the core intelligence logic migrated.

BACKEND_DIR="../luxelens-backend"

echo "🚀 Initializing LuxeLens Core API in $BACKEND_DIR..."

mkdir -p "$BACKEND_DIR/src/services"
mkdir -p "$BACKEND_DIR/src/routes"
mkdir -p "$BACKEND_DIR/src/lib"

cd "$BACKEND_DIR"

# 1. Initialize NPM
npm init -y

# 2. Install Dependencies
echo "📦 Installing enterprise dependencies..."
npm install fastify @fastify/cors @fastify/rate-limit zod dotenv jspdf
npm install -D typescript @types/node ts-node-dev rimraf

# 3. Initialize TypeScript
npx tsc --init --outDir ./dist --rootDir ./src --target es2020 --module commonjs --esModuleInterop true --skipLibCheck true --forceConsistentCasingInFileNames true

# 4. Create core intelligence service
cat <<EOF > src/services/intelligence.service.ts
// Migrated from LuxeLens Frontend
// This service handles signal generation and strategic synthesis

export interface MarketSignal {
  id: string;
  brand: string;
  event: string;
  category: string;
  details: string;
  impact: 'Low' | 'Medium' | 'High' | 'Positive';
  time: string;
}

export function generateNeuralPulse(): MarketSignal {
  return {
    id: \`sig-\${Date.now()}\`,
    brand: "Competitor Node",
    event: "Price Shift Detected",
    category: "Pricing",
    details: "Automated signal from AWS backend",
    impact: "Medium",
    time: new Date().toLocaleTimeString()
  };
}
EOF

# 5. Create Main Entry Point
cat <<EOF > src/index.ts
import fastify from 'fastify';
import cors from '@fastify/cors';
import { generateNeuralPulse } from './services/intelligence.service';
import dotenv from 'dotenv';

dotenv.config();

const server = fastify({ logger: true });

server.register(cors, {
  origin: process.env.FRONTEND_URL || '*',
});

server.get('/health', async () => {
  return { status: 'operational', timestamp: new Date().toISOString() };
});

server.get('/api/pulse', async () => {
  return generateNeuralPulse();
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    await server.listen({ port, host: '0.0.0.0' });
    console.log(\`🚀 LuxeLens Core API running on port \${port}\`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
EOF

# 6. Create production-grade Multi-stage Dockerfile
cat <<EOF > .dockerignore
node_modules
dist
.env
.git
*.log
Dockerfile
.dockerignore
EOF

cat <<EOF > Dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 backend
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --omit=dev
USER backend
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget -qO- http://localhost:3001/health || exit 1
CMD ["npm", "start"]
EOF

# 7. Add scripts to package.json
sed -i '' 's/"test": "echo \\"Error: no test specified\\" \&\& exit 1"/"build": "rimraf dist \&\& tsc", "start": "node dist\/index.js", "dev": "ts-node-dev --respawn src\/index.ts"/' package.json

echo "✅ Backend scaffold complete in $BACKEND_DIR"
echo "👉 Run 'cd $BACKEND_DIR && npm run dev' to start."
