env = development
env_file = .env.$(env)

compose = docker-compose --env-file $(env_file)
ifeq ($(env), production)
	compose = docker-compose -f docker-compose.yml -f docker-compose.production.yml --env-file $(env_file)
endif
exec = $(compose) exec web

build =
silent =
tty =
build_flag=
silent_flag=--abort-on-container-exit
tty_flag=

GREEN='\033[0;32m'
NO_COLOUR='\033[0m'

ifdef build
	build_flag = --build
endif

ifdef silent
	silent_flag = --detach
endif

ifdef tty
	tty_flag = -T
endif

all:
	make up build=1 silent=$(silent)
build:
	$(compose) build --build-arg RAILS_ENV=$(env)
up:
	$(compose) up --renew-anon-volumes --remove-orphans $(build_flag) $(silent_flag)
down:
	$(compose) down
rspec:
	$(compose) exec $(tty_flag) $(silent_flag) web bundle exec rspec $(args)
bash:
	$(exec) sh
wait:
	until $$(curl --output /dev/null --silent --head --fail http://localhost:8080/health); do sleep 1; done
ci:
	@set -e
	@echo -e "${GREEN}=== Building App ===${NO_COLOUR}"
	@make build
	@echo -e "${GREEN}=== Running App ===${NO_COLOUR}"
	@make up silent=1
	@echo -e "${GREEN}=== Waiting for app to start ===${NO_COLOUR}"
	@make wait
	@echo -e "${GREEN}=== Running Tests ===${NO_COLOUR}"
	@make rspec tty=1
prune:
	make down
	docker container prune -f
	docker volume prune -f
	docker image prune -f
rake:
	$(exec) rake $(task)
rails:
	$(exec) rails $(task)
console:
	make rails task=c
migrate:
	make rake task='db:migrate'
bundle:
	$(exec) bundle $(task)
update:
	$(exec) bundle task=update
swagger:
	set -e
	swagger-cli bundle -t yaml -o docs/spec.yml docs/openapi.yaml
	swagger-cli validate --no-schema docs/spec.yml
	cat docs/spec.yml | pbcopy
	open https://editor.swagger.io
deploy:
	docker buildx build --platform linux/amd64 --build-arg RAILS_ENV=production -t app .
	docker tag app registry.heroku.com/galaxia-app/web
	docker push registry.heroku.com/galaxia-app/web
	heroku container:release web -a galaxia-app
reset:
	heroku pg:reset -a --confirm galaxia-app
revert:
	$(exec) rake db:migrate VERSION=0
.PHONY: list
list:
	@LC_ALL=C $(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'
