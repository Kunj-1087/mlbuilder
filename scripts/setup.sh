#!/bin/bash
echo "Setting up MLBuilder dev environment..."
cp -n .env.example .env.local
npm install
npm run db:start
echo "Waiting for Postgres to be ready..."
sleep 5
npx prisma migrate dev --name initial_schema
npx prisma db seed
echo "Setup complete. Run 'npm run dev' to start the app."
