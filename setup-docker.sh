#!/usr/bin/env bash

set -e

# ----------------------------------------

# CONFIG

# ----------------------------------------

DEV_FILES="-f docker-compose.yml -f docker-compose.dev.yml"
PROD_FILES="-f docker-compose.yml -f docker-compose.prod.yml"

# ----------------------------------------

# FUNCTIONS

# ----------------------------------------

check_docker() {
if ! command -v docker &> /dev/null; then
echo "❌ Docker is not installed."
exit 1
fi

if ! docker compose version &> /dev/null; then
echo "❌ Docker Compose v2 is not available."
exit 1
fi
}

setup_env() {
MODE=$1

if [ "$MODE" == "dev" ]; then
if [ ! -f .env.dev ]; then
echo "⚠️ Creating .env.dev template..."
cat <<EOF > .env.dev
PORT=3000
DATABASE_URL=postgresql://neondb_owner:npg_bFJY8vLSVTM6@ep-orange-cherry-ad21s14e-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=dev_secret
EOF
fi
cp .env.dev .env
fi

if [ "$MODE" == "prod" ]; then
if [ ! -f .env.prod ]; then
echo "❌ .env.prod not found!"
exit 1
fi
cp .env.prod .env
fi
}

run_dev() {
echo "🚀 Starting DEV environment..."
docker compose $DEV_FILES up --build
}

run_prod() {
echo "🚀 Starting PROD environment..."
docker compose $PROD_FILES up -d --build
}

stop_all() {
echo "🛑 Stopping containers..."
docker compose down
}

clean_all() {
echo "⚠️ Cleaning everything..."
docker compose down -v --rmi all
}

# ----------------------------------------

# MAIN

# ----------------------------------------

if [ $# -eq 0 ]; then
echo "Usage: ./setup-docker.sh [dev|prod|stop|clean]"
exit 1
fi

check_docker

case "$1" in
dev)
setup_env dev
run_dev
;;
prod)
setup_env prod
run_prod
;;
stop)
stop_all
;;
clean)
clean_all
;;
*)
echo "❌ Invalid option"
;;
esac
