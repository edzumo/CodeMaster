FROM node:20-alpine

WORKDIR /app

COPY runner.sh /runner.sh
RUN sed -i 's/\r$//' /runner.sh
RUN chmod +x /runner.sh