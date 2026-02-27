FROM gcc:13

WORKDIR /app

COPY runner.sh /runner.sh
RUN sed -i 's/\r$//' /runner.sh
ENTRYPOINT ["/runner.sh"]