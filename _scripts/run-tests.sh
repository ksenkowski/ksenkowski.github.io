#!/usr/bin/env bash
set -e
gulp build:test
bundle exec scss-lint _assets/css/scss/*/*.scss
