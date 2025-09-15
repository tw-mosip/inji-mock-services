This project implements Jira Ticket [INJIMOB-3320](https://mosip.atlassian.net/browse/INJIMOB-3320)

### Overview
A common Spring Boot service that can dynamically accept, validate, store, and retrieve JSON (Map<String, Object>) payloads so that all use-cases can reuse the same service and store dynamic data structures in a PostgreSQL DB with validation and flexible schema mapping.

## Running the application locally
1. Pull the repository locally to your system
2. Run the command `docker-compose up` to start the databases
3. Run the command `./mvwn spring-boot:run` to start the application

## Project Structure

```
ProjectDir
├── docker-compose.yml
├── HELP.md
├── init
│   ├── 1-init.sql
│   └── 2-farmer-schema.sql
├── mvnw
├── mvnw.cmd
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── mosip
│   │   │           └── inji_usecase
│   │   │               ├── InjiDataCreationApp.java
│   │   │               ├── config
│   │   │               │   ├── CorsConfig.java
│   │   │               ├── controller
│   │   │               │   └── DataController.java
│   │   │               ├── entity
│   │   │               │   └── GenericEntity.java
│   │   │               └── service
│   │   │                   ├── GenericCrudService.java
│   │   │                  
│   │       ├── application.properties
│   │       ├── 

The project mostly follows Java Spring Boot structure.
