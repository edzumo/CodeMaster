FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY runner.sh /runner.sh
RUN sed -i 's/\r$//' /runner.sh
ENTRYPOINT ["/runner.sh"]