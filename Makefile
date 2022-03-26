dev:
	docker system prune -a
	docker-compose up -d &
	cd sapper && npm i && npm run dev &
	cd nestjs && npm i && npm run dev &
init_docker:
	../init_docker.sh