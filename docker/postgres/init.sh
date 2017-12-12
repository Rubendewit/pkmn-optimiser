#!/usr/bin/env bash

eval $(egrep -v '^#' ../var/.env | xargs)

pip install -U pip
pip install virtualenv

virtualenv -p python2 ./

pip install psycopg2

python setup.py develop

pokedex load -e postgresql://$PG_USERNAME:$PG_PASSWORD@localhost/$PG_DATABASE
pokedex reindex -e postgresql://$PG_USERNAME:$PG_PASSWORD@localhost/$PG_DATABASE
