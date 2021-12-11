#!/bin/sh
set -e

mkdir -p tmp/pids

echo "== Removing pid files =="
rm -f tmp/pids/server.pid

if [[ "$RAILS_ENV" != "production" ]]; then
  echo "== Waiting for Database =="
  while ! pg_isready -h db -p 5432 -q -U "${DB_USER}"; do
    echo >&2 "    > Postgres DB is unavailable - waiting"
    sleep 1
  done
fi

echo "== Database Ready =="
#bundle exec rake db:exists || exists=false

echo "== Preparing Database =="
bundle exec rake db:prepare

#if [[ "$exists" == "false" ]]; then
  echo "== Seeding Database =="
  bundle exec rake db:seed
  echo "== Database Seeded =="
#fi

echo "== Running App =="
# Then exec the container's main process (what's set as CMD in the Dockerfile).
exec "$@"
