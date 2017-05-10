#!/bin/bash

# Enable error reporting to the console.
set -e

# Install bundles if needed
bundle check || bundle install

# NPM install if needed.
 npm install

# Build the site.
gulp clean
gulp

# Checkout master and remove everything
git clone https://${GH_TOKEN}@github.com/ksenkowski/ksenkowski.github.io ../../ksenkowski.github.io.master
cd ../../ksenkowski.github.io.master
git checkout master
rm -rf *

# Copy generated HTML site from source branch in original repo.
# Now the master branch will contain only the contents of the _site directory.
cp -R ~/Documents/repos/ksenkowski.github.io/_site/* .

# Make sure we have the updated .travis.yml file so tests won't run on master.
cp ~/Documents/repos/ksenkowski.github.io/.travis.yml .
git config user.email ${GH_EMAIL}
git config user.name "ksenkowski"

# Commit and push generated content to master branch.
git status
git add -A .
git status
git commit -a -m "Travis #$TRAVIS_BUILD_NUMBER"
git push --quiet origin master > /dev/null 2>&1