.PHONY: help setup start stop restart logs clean test migrate seed

# Detect docker-compose command
DOCKER_COMPOSE := $(shell command -v docker-compose 2> /dev/null)
ifndef DOCKER_COMPOSE
	DOCKER_COMPOSE := docker compose
endif

help:
	@echo "GraceLedger - Available Commands"
	@echo ""
	@echo "  make setup      - Initial setup (create env files, start containers)"
	@echo "  make start      - Start all services"
	@echo "  make stop       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - View logs"
	@echo "  make clean      - Remove containers and volumes"
	@echo "  make test       - Run tests"
	@echo "  make migrate    - Run database migrations"
	@echo "  make seed       - Seed database"
	@echo ""

setup:
	@chmod +x setup.sh
	@./setup.sh

start:
	@$(DOCKER_COMPOSE) up -d
	@echo "✅ Services started"

stop:
	@$(DOCKER_COMPOSE) down
	@echo "✅ Services stopped"

restart:
	@$(DOCKER_COMPOSE) restart
	@echo "✅ Services restarted"

logs:
	@$(DOCKER_COMPOSE) logs -f

clean:
	@$(DOCKER_COMPOSE) down -v
	@echo "✅ Containers and volumes removed"

test:
	@echo "Running backend tests..."
	@$(DOCKER_COMPOSE) exec server npm test
	@echo "Running frontend tests..."
	@$(DOCKER_COMPOSE) exec client npm test

migrate:
	@$(DOCKER_COMPOSE) exec server npx prisma migrate dev

seed:
	@$(DOCKER_COMPOSE) exec server npm run seed

shell-server:
	@$(DOCKER_COMPOSE) exec server sh

shell-client:
	@$(DOCKER_COMPOSE) exec client sh

db-studio:
	@$(DOCKER_COMPOSE) exec server npx prisma studio
