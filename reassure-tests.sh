#!/usr/bin/env bash
set -e

BASELINE_BRANCH=${BASELINE_BRANCH:="main"}

# Required for `git switch` on CI
git fetch origin

# Fixes fatal: 'main' matched multiple (2) remote tracking branches on github actions
git config checkout.defaultRemote=origin

# Gather baseline perf measurements
git switch "$BASELINE_BRANCH"
yarn install --force
yarn reassure --baseline

# Gather current perf measurements & compare results
git switch --detach -
yarn install --force
yarn reassure
