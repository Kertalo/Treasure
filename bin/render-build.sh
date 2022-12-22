#!/usr/bin/env bash
# exit on error
set -o errexit

bundel install
yarn install
bundel exec rake assets:precompile
bundel exec rake assets:clean
bundel exec rake db:migrate