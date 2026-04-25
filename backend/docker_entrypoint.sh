#!/bin/bash
set -e

# Installing dependencies
npm i

exec "$@"
