#!/bin/sh

set -e
npm install
grunt ci
tar -cvzf express-dblogger.tar.gz ./*
