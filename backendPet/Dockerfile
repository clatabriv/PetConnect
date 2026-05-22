FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

# Copiar el wrapper de Maven y el pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Dar permisos de ejecución a mvnw
RUN chmod +x mvnw

# Descargar dependencias
RUN ./mvnw dependency:go-offline

# Copiar el código fuente
COPY src src

# Compilar la aplicación
RUN ./mvnw clean package -DskipTests

# Imagen final más ligera
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el jar compilado
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
