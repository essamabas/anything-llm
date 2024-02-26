#!/bin/bash
{ cd /app/server/ &&\
  npx prisma generate --schema=./prisma/schema.prisma &&\
  npx prisma migrate deploy --schema=./prisma/schema.prisma &&\
  node /app/server/index.js > /app/server/storage/server.log
} &
{ node /app/collector/index.js; } &
{ python3 /app/agent/jiraAgent/main.py > /app/server/storage/agent.log; } &
wait -n
exit $?
