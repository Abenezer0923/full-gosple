#!/bin/bash

echo "🚀 Setting up GraceLedger..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed (try both versions)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo ""
    echo "Install options:"
    echo "1. sudo apt install docker-compose"
    echo "2. Or follow: https://docs.docker.com/compose/install/"
    exit 1
fi

# Create environment files
echo "📝 Creating environment files..."

if [ ! -f server/.env ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env"
fi

if [ ! -f client/.env ]; then
    cp client/.env.example client/.env
    echo "✅ Created client/.env"
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
$DOCKER_COMPOSE up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
$DOCKER_COMPOSE exec -T server npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database..."
$DOCKER_COMPOSE exec -T server npm run seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "👤 Default login:"
echo "   Email:    admin@graceledger.com"
echo "   Password: admin123"
echo ""
echo "📚 Next steps:"
echo "   1. Update Cloudinary credentials in server/.env"
echo "   2. Visit http://localhost:3000 to access the application"
echo "   3. Check logs: docker-compose logs -f"
echo ""
