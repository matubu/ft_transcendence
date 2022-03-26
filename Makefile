db:
	docker system prune -a
	docker-compose up -d
sapper:
	cd sapper && npm i && npm run dev
nestjs:
	cd nestjs && npm i && npm run dev
init_docker:
	../init_docker.sh

.PHONY: db sapper nestjs init_docker