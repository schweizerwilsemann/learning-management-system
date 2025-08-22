# LMS Platform Makefile

# ===== Variables =====
FRONTEND_DIR := lms/lms-ui
BACKEND_DIR  := lms/lms-api
DB_DIR       := packages/db

SHELL := /bin/bash

# ===== Help =====
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  install          - Install all dependencies"
	@echo "  dev              - Start development servers (frontend + backend)"
	@echo "  dev-frontend     - Start frontend development server"
	@echo "  dev-backend      - Start backend development server"
	@echo "  build            - Build all packages"
	@echo "  build-frontend   - Build frontend"
	@echo "  build-backend    - Build backend"
	@echo "  db-generate      - Generate Prisma client"
	@echo "  db-migrate       - Run database migrations"
	@echo "  db-studio        - Open Prisma Studio"
	@echo "  db-reset         - Reset database"
	@echo "  clean            - Clean build artifacts"
	@echo "  test             - Run tests"
	@echo "  docker-up        - Start Docker services"
	@echo "  docker-down      - Stop Docker services"
	@echo "  setup            - Setup project (install + db-generate)"
	@echo "  setup-env        - Create env files if missing"

# ===== Install =====
.PHONY: install
install:
	@echo "Installing dependencies..."
	pnpm install
	@echo "Dependencies installed successfully!"

# ===== Development =====
.PHONY: dev
dev:
	@echo "Starting development servers..."
	@$(MAKE) -j2 dev-frontend dev-backend

.PHONY: dev-frontend
dev-frontend:
	@echo "Starting frontend development server..."
	cd $(FRONTEND_DIR) && pnpm dev

.PHONY: dev-backend
dev-backend:
	@echo "Starting backend development server..."
	cd $(BACKEND_DIR) && pnpm start:dev

# ===== Build =====
.PHONY: build
build:
	@echo "Building all packages..."
	@$(MAKE) -j2 build-frontend build-backend

.PHONY: build-frontend
build-frontend:
	@echo "Building frontend..."
	cd $(FRONTEND_DIR) && pnpm build

.PHONY: build-backend
build-backend:
	@echo "Building backend..."
	cd $(BACKEND_DIR) && pnpm build

# ===== Database =====
.PHONY: db-generate
db-generate:
	@echo "Generating Prisma client..."
	cd $(DB_DIR) && pnpm prisma generate

.PHONY: db-migrate
db-migrate:
	@echo "Running database migrations..."
	cd $(DB_DIR) && pnpm prisma migrate dev

.PHONY: db-studio
db-studio:
	@echo "Opening Prisma Studio..."
	cd $(DB_DIR) && pnpm prisma studio

.PHONY: db-reset
db-reset:
	@echo "Resetting database..."
	cd $(DB_DIR) && pnpm prisma migrate reset

# ===== Utilities =====
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(FRONTEND_DIR)/.next
	rm -rf $(BACKEND_DIR)/dist
	rm -rf node_modules
	rm -rf $(FRONTEND_DIR)/node_modules
	rm -rf $(BACKEND_DIR)/node_modules
	@echo "Clean completed!"

.PHONY: test
test:
	@echo "Running tests..."
	cd $(BACKEND_DIR) && pnpm test

# ===== Docker =====
.PHONY: docker-up
docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

.PHONY: docker-down
docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

# ===== Setup =====
.PHONY: setup
setup: install db-generate
	@echo "Setup completed! Run 'make dev' to start development servers."

.PHONY: setup-env
setup-env:
	@echo "Setting up environment files..."
	@if [ ! -f "$(BACKEND_DIR)/.env" ]; then \
		cp "$(BACKEND_DIR)/env.example" "$(BACKEND_DIR)/.env"; \
		echo "Backend .env file created from example"; \
	else \
		echo "Backend .env already exists, skipping"; \
	fi
	@if [ ! -f "$(FRONTEND_DIR)/.env.local" ]; then \
		echo "Please create $(FRONTEND_DIR)/.env.local with the configuration from README.md"; \
	else \
		echo "$(FRONTEND_DIR)/.env.local already exists, skipping"; \
	fi
