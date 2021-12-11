# Galaxia Backend

Source code for the Ruby on Rails RESTful JSON API backend for Galaxia deployed on Heroku.

## Table of Contents

- [Galaxia Backend](#galaxia-backend)
    - [Table of Contents](#table-of-contents)
    - [Dependencies](#dependencies)
    - [Development](#development)
        - [Running a Shell](#running-a-shell)
        - [Running the Rails Console](#running-the-rails-console)
        - [Updating Gems](#updating-gems)
    - [Testing](#testing)
    - [Deployment](#deployment)
    - [Makefile](#makefile)
    - [Production Deployment](#production-deployment)
    - [Documentation](#documentation)
    - [License](#license)

## Dependencies

The following dependencies are required for development:

- [**Docker**](https://docs.docker.com/get-docker/)
- [**Docker Compose**](https://docs.docker.com/compose/install/)
- [**Heroku CLI**](https://devcenter.heroku.com/articles/heroku-cli)
- [**Ruby (version 2.7.3)**](https://www.ruby-lang.org/en/downloads/)
- [**Postgres**](https://www.postgresql.org/download/)
- [**Bundler**](https://bundler.io)

To validate the API specification and to compile a single `YAML` file, you will need the following dependencies:

- [**Node.js**](https://nodejs.org/en/download/)
- [**Swagger CLI npm package**](https://www.npmjs.com/package/swagger-cli)

Note that the scripts in the [`tools`](tools) directory are intended to be run when in
a [shell window, running in the container](#running-a-shell).

- Besides [`tools/entrypoint.sh`](tools/entrypoint.sh) - this is used by the [`Dockerfile`](Dockerfile).

## Development

For development (and testing), the container must be built and run using the commands in the ["Deployment"](#deployment)
section - the app does not work outside the container unless you change the `DB_HOST`
attribute in [.env.development](.env.development#L5) file to `localhost`.

To run any `rake` or `rails` commands, they must be prefixed with:

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web
```

If any gems are added/removed from the [`Gemfile`](Gemfile), the container must be rebuilt.

Any external migrations made to the database require both the Docker containers and volumes to be purged.

First, stop the application:

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] down
```

Then, list all running containers:

```bash
docker container ls -a
```

This should produce something like:

```bash
CONTAINER ID   IMAGE              COMMAND                  CREATED             STATUS                      PORTS                                       NAMES
2983d9c941ff   rails-docker_web   "entrypoint.sh bash …"   2 hours ago         Up 2 hours                  0.0.0.0:8080->8080/tcp, :::8080->8080/tcp   rails-docker_web_1
bf14c51781b6   postgres           "docker-entrypoint.s…"   2 hours ago         Up 2 hours                  0.0.0.0:5432->5432/tcp, :::5432->5432/tcp   rails-docker_db_1
2f559153d692   redis:5.0.7        "docker-entrypoint.s…"   2 hours ago         Up 2 hours                  0.0.0.0:6379->6379/tcp, :::6379->6379/tcp   rails-docker_redis_1
```

Plus any other containers you may have running.

Now, one by one:

```bash
docker container rm [ID]
```

And replace `[ID]` with the values shown in the `CONTAINER ID` column.

Now, the same must be done for the docker volumes:

List all persisted volumes:

```bash
docker volume ls
```

This should produce something like:

```bash
DRIVER    VOLUME NAME
local     rails-docker_app_postgres
local     rails-docker_app_redis
```

Plus any other volumes you may have on your system.

Now, one by one:

```bash
docker volume rm [VOLUME]
```

And replace `[VOLUME]` with the values shown in the `VOLUME NAME` column.

Alternatively, if you only have these containers on your system, you can use:

```bash
docker container prune
```

And enter `y` when prompted to delete the containers at once.

And for volumes (if you only have volumes for this application):

```bash
docker volume prune
```

Entering `y` when prompted.

Again, this is recommended only if you have docker containers and volumes related to this application stored on your
system, and nothing else.

### Running a Shell

To run a shell in the container, assuming it is already running:

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web sh
```

Or

```bash
docker -ti web /bin/bash
```

And quit it using:

```bash
exit
```

When in a shell in the container, the
prefix `docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web`
is not needed.

- Nor is `bundle exec` (may be required to silence some `RSpec` warnings).

### Running the Rails Console

When the app is already running with `docker-compose up`, attach to the container:

```bash
docker compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web bin/rails c
```

If no container is running yet, start up a new one:

```bash
docker compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] run --rm web bin/rails c
```

### Updating Gems

To update the gems in the project:

```bash
docker compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] run --rm web bundle update
```

## Testing

To run the test suites ([assuming the container is running](#deployment)):

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web rspec
```

This will generate a coverage report with a summary printed in the terminal.

To see the full coverage report in a browser window:

```bash
open coverage/index.html
```

Note that this command is not available inside the container.

## Deployment

The API is containerised using Docker and Docker Compose to make for simple deployment.

Before running the application in a `production` environment, you will need to create a `.env.production` file to store
environment variables.

- The production `DotEnv` file **must** have the same environment variables defined as the
  development ([`.env.development`](.env.development)) `DotEnv` file.

Navigate to the main directory, where this `README` is located, and run:

```bash
touch .env.production && cat .env.development > .env.production
```

To copy the contents of the development `DotEnv` file into the production file.

`.env.production` should then contain:

```dotenv
DB_NAME=[OMITTED]
DB_USER=[OMITTED]
DB_PASS=[OMITTED]
DB_HOST=[OMITTED]
DB_PORT=[OMITTED]

REDIS_HOST=redis

RAILS_ENV=development # TODO: Replace this with `production`
RAKE_ENV=development # TODO: Replace this with `production`

GUEST_USERNAME=guest
GUEST_PASSWORD=[OMITTED]

DEVISE_JWT_SECRET_KEY=[OMITTED]

GCS_PROJECT_NAME=[OMITTED]
GCS_PROJECT_ID=[OMITTED]
GCS_BUCKET_NAME=[OMITTED]
```

You will then need to replace the `[OMITTED]` values.

Note that `.env.production` requires a `DATABASE_URL` field linking to the cloud database instead of the `DB_` prefixed
attributes defined above.

The value for the `DEVISE_JWT_SECRET_KEY` field can be generated using:

```bash
rake secret
```

The environment variables `GCS_PROJECT_NAME`, `GCS_PROJECT_ID` and `GCS_BUCKET_NAME` can be obtained from either the
Firebase or Google Cloud consoles.

* You will also need to generate a JSON keyfile.
* Instructions can be found [here](https://cloud.google.com/iam/docs/creating-managing-service-account-keys), assuming
  access to the Google Cloud bucket.
* Once the file has been downloaded, rename it to `galaxia-gcs.json` and move it into `config/secrets`.

<hr />

To build the application:

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] build
```

Replacing `[ENVIRONMENT]` with either `development` (for a development environment) or `production` (for a production
environment).

Once the container is built, the above command will not need to be used to start the application, unless dependencies
are changed.

To start the application:

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] up --renew-anon-volumes
```

The application will create the local development database with a development user if it does not exist. The database
persists between runs of the application unless the Docker volumes are manually purged.

To stop the application, open a new terminal, in the same directory the application was started in, and run:

```bash
docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] down
```

This shutdown method is preferred over `CTRL + C`.

## Makefile

A `Makefile` is included to shorten common `Docker` and `docker-compose` commands to the following:

- Note that if a `make` action has arguments (all optional), a value should be supplied with it e.g., `build=1` (instead
  of just `build`).
- The `env` argument value can either be `development` or `production`. If no `env` is provided, it defaults to the
  development (`development`) environment.
- `make list` can be used to print all available actions.
    - Use `make list | xargs` to output the actions on a single line.

<table>
<thead>
<th align="center">Action</th>
<th align="center">Arguments</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td align="center"><pre>make</pre></td>
<td align="center">
<pre>env</pre>
<pre>silent</pre>
</td>
<td>
Build and run the application in an environment specified by <code>env</code>.
<br>The <code>silent</code> flag specifies whether the application should run in the background, without any output.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] up --build</code>
</td>
</tr>
<tr>
<td align="center"><pre>make build</pre></td>
<td align="center">
<pre>env</pre>
<pre>silent</pre>
</td>
<td>
Build the application in an environment specified by <code>env</code>.
<br>The <code>silent</code> flag specifies whether the application should run in the background, without any output.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] build</code>
</td>
</tr>
<tr>
<td align="center"><pre>make up</pre></td>
<td align="center">
<pre>env</pre>
<pre>silent</pre>
<pre>build</pre>
</td>
<td>
Run the application in an environment specified by <code>env</code>.
<br>The <code>silent</code> flag specifies whether the application should run in the background, without any output.
<br>The <code>build</code> flag specifies whether the container should also be (re-) built before running.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] up</code>
</td>
</tr>
<tr>
<td align="center"><pre>make down</pre></td>
<td align="center"><pre>env</pre></td>
<td>
Safely stop the application.
<br>Equivalent to: <code>docker-compose down</code>
</td>
</tr>
<tr>
<td align="center"><pre>make rspec</pre></td>
<td align="center"><pre>env</pre></td>
<td>Run tests for the application in an environment specified by <code>env</code>.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web rspec</code></td>
</tr>
<tr>
<td align="center"><pre>make bash</pre></td>
<td align="center"><pre>env</pre></td>
<td>Start a shell in the application container, in an environment specified by <code>env</code> (assuming the application is already running.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web sh</code></td>
</tr>
<tr>
<td align="center"><pre>make ci</pre></td>
<td align="center"><pre>env</pre></td>
<td>Build and run the application and then run tests - used for CI/CD workflow runs in an environment specified by <code>env</code>.</td>
</tr>
<tr>
<td align="center"><pre>make prune</pre></td>
<td align="center"><pre>env</pre></td>
<td>Stop and delete all containers and volumes.
<br>Equivalent to:
<br><code>docker-compose down</code>
<br><code>docker container prune -f</code>
<br><code>docker volume prune -f</code></td>
</tr>
<tr>
<td align="center"><pre>make rake</pre></td>
<td align="center">
<pre>env</pre>
<pre>task</pre>
</td>
<td>Run a <code>rake</code> task in an environment specified by <code>env</code> (assuming the application is already running).
<br><code>task</code> is a string - the task to be run.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web rake [TASK]</code></td>
</tr>
<tr>
<td align="center"><pre>make rails</pre></td>
<td align="center">
<pre>env</pre>
<pre>task</pre>
</td>
<td>Run a <code>rails</code> task in an environment specified by <code>env</code> (assuming the application is already running).
<br><code>task</code> is a string - the task to be run.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web rails [TASK]</code></td>
</tr>
<tr>
<td align="center"><pre>make bundle</pre></td>
<td align="center">
<pre>env</pre>
<pre>task</pre>
</td>
<td>Run a <code>bundler</code> task in an environment specified by <code>env</code> (assuming the application is already running).
<br><code>task</code> is a string - the task to be run.
<br>Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[ENVIRONMENT].yml --env-file .env.[ENVIRONMENT] exec web bundle [TASK]</code></td>
</tr>
<tr>
<td align="center"><pre>make wait</pre></td>
<td align="center"><pre>port</pre></td>
<td>Wait until a server at <code>localhost:port</code> is running.</td>
</tr>
<tr>
<td align="center"><pre>make swagger</pre></td>
<td align="center"></td>
<td>Generate and validate a single OpenAPI <code>spec.yml</code> file, copying its contents to the clipboard and opens the Swagger Editor in a browser where you can paste the file contents to view the API documentation.</td>
</tr>
<tr>
<td align="center"><pre>make deploy</pre></td>
<td align="center"></td>
<td>Deploy the application to Heroku - requires a login and collaborator access to the application.</td>
</tr>
<tr>
<td align="center"><pre>make reset</pre></td>
<td align="center"></td>
<td>Drop all the tables in the production database. Used when the database structure needs changing (or purging). Requires a login and collaborator access to the application.Equivalent to: <code>heroku pg:reset -a --confirm galaxia-app</code></td>
</tr>
<tr>
<td align="center"><pre>make revert</pre></td>
<td align="center"></td>
<td>Drop all the tables in the database (either development or production). Used when the database structure needs changing (or purging). Equivalent to: <code>docker-compose -f docker-compose.yml -f docker-compose.[override/production].yml --env-file .env.[ENVIRONMENT] exec web rake db:migrate VERSION=0</code></td>
</tr>
</tbody>
</table>

Common commands can be added to the `Makefile`.

## Production Deployment

The app is deployed to Heroku on every push that passes all CI checks and tests.

To (manually) deploy the backend to Heroku:

```bash
make deploy
```

Note that this requires collaborator access to the Heroku application.

Also note that on M1 Mac devices, the [Gemfile.lock](Gemfile.lock) file may have to be deleted before
running `make deploy` to prevent Docker trying to use a native M1 version of `nokogiri` in the Linux container.

- The file can be generated again by running `bundle install`.

The production API is then available at:

```bash
https://galaxia-app.herokuapp.com
```

With the available endpoints listed in the [Documentation](#documentation) section.

## Documentation

The API is documented using [OpenAPI (Swagger)](https://www.openapis.org) version 3.0.

To compile the documentation and view all endpoints, request and response schemas:

```bash
make swagger
```

Which will compile the `YAML` files in the [`docs`](docs) directory into a single `spec.yml` file.

- Note that this requires the [**Swagger CLI npm package**](https://www.npmjs.com/package/swagger-cli).
- The contents of the generated `spec.yml` file will then be copied to your clipboard where you can paste it into the
  [Swagger Editor](https://editor.swagger.io) that is opened automatically by the `make swagger` action.

Any endpoints added to the API should also be documented and stored in the [`docs`](docs) directory.

Endpoints can also be viewed using (in or outside of a container):

```bash
rails routes
```

Note that this also includes some `rails`-based endpoints.

## License

TBD
