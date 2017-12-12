FROM postgres:9-alpine

ARG PG_USERNAME
ARG PG_PASSWORD
ARG PG_DATABASE

ENV POSTGRES_USER $PG_USERNAME
ENV POSTGRES_PASSWORD $PG_PASSWORD
ENV POSTGRES_DB $PG_DATABASE

ADD init.sh /docker-entrypoint-initdb.d

RUN apk update
RUN apk add sudo git python python-dev py-pip build-base --no-cache

RUN git clone git://github.com/veekun/pokedex.git
WORKDIR /pokedex

RUN chown -R postgres /bin /usr /pokedex
