#!/bin/bash
psql -v ON_ERROR_STOP=1 --username chinook_admin -d "chinook" < /docker-entrypoint-initdb.d/0080-netflix.sql.dmp
