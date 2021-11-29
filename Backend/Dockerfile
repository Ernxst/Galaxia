# syntax=docker/dockerfile:1

ARG RAILS_ENV=development

FROM ruby:2.7.3-alpine AS base

# Install system dependencies required both at runtime and build time
RUN apk add --update \
        postgresql-dev \
        tzdata

# This stage will be responsible for installing gems
FROM base AS dependencies

# Install system dependencies required to build some Ruby gems (pg)
RUN apk add --update build-base

# Install gems
ARG RAILS_ENV
ENV BUNDLER_VERSION=2.2.24
RUN gem install bundler:$BUNDLER_VERSION
COPY Gemfile Gemfile.lock ./
RUN if [[ "$RAILS_ENV" == "production" ]] ; then bundle config set without development test ; else bundle config set --local without production ; fi
RUN bundle install --jobs=3 --retry=3

FROM base AS runtime

ARG RAILS_ENV
# For the pg_isready command
RUN if [[ "$RAILS_ENV" != "production" ]] ; then apk add --no-cache postgresql-client ; fi

# Add a script to be executed every time the container starts.
COPY tools/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# Prepare working directory
WORKDIR /home/app

# Copy gems from build stage, containing the already built artifact
COPY --from=dependencies /usr/local/bundle/ /usr/local/bundle/

# Copy source code
COPY . .

CMD ["bundle", "exec", "puma" ,"-C" ,"config/puma.rb"]