# Etapa 1: Construcci?n del backend
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -B -DskipTests clean package

# Etapa 2: Ejecuci?n de Spring Boot
FROM eclipse-temurin:17-jre

WORKDIR /app

ENV PORT=8080

EXPOSE 8080

COPY --from=build /app/target/*.jar /app/app.jar

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
