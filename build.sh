#!/bin/bash

# Enable error reporting to the console.
set -e

# Install bundles if needed
# bundle check || bundle install

# NPM install if needed.
# . $HOME/.nvm/nvm.sh && nvm install 6.1 && nvm use 6.1
# npm install

# Build the site.
gulp clean
gulp

# Checkout master and remove everything
git clone https://${GH_TOKEN}@github.com/ksenkowski/ksenkowski.github.io ../ksenkowski.github.io.master
cd ../ksenkowski.github.io.master
git checkout master
rm -rf *

# Copy generated HTML site from source branch in original repo.
# Now the master branch will contain only the contents of the _site directory.
cp -R ../ksenkowski.github.io/_site/* .

# Commit and push generated content to master branch.
git status
git add -A .
git status
git commit -a -m "Initial Build of New Site"
git push --quiet origin master > /dev/null 2>&1