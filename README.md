# Mafia Platform
## Github workflow description

## Github workflow description

#### Branches and branches naming conventions

- main - the main branch of the project
- **naming convention for other branches:** `[<issue-name>,<issue-description>]`

#### Pushing

- pushing to feature branches: unrestricted
- pushing to main: not allowed

#### Pull requests & Merging strategy:

- A PR needs one approval before being merged (unless the user who is pushing has bybass permissions)
- Merging strategy: merge commit

## Rinning Team Services
1. Creating and setting up the .env file:
First of all you must create an .env file with the following contents:
```
POSTGRES_USER=<postgres_user>
POSTGRES_PASSWORD=<postgres_password>
PGADMIN_DEFAULT_EMAIL=<your_email>
PGADMIN_DEFAULT_PASSWORD=<pgadmin_password>
```
2. Kill all containers and processes that are running on ports 3000, 3005, 8080, 8081, 8180, 8181, 5000, 5001, 4001, 4001, 27017, 27019, 27018, 5432, 5442, 5443
Those represent the services and databases ports.
3. run:
```
docker-compose up -d
```

### DockerHub Services
- **User Management Service:** `nadea39/user-management-service:1.4` (Port 3000)
- **Game Service:** `nadea39/gameservice:v1.0.0` (Port 3005)
- **Character Service** `livia994/characterservice:1.3` (port 4002)
- **Town Service** `livia994/townservice:1.0 ` (port 4001)
- **Shop Service** `catalinaernu/shopservice:1.0` (port 5000)
- **Roleplay Service** `catalinaernu/roleplayservice:1.0` (port 5001)
- **Task Service** `vladamusin/task-service:v2.0` (port 8180)
- **Voting Service** `vladamusin/voting-service:v2.0` (port 8181)


# Test endpoints
curl http://localhost:3000/users
curl http://localhost:3005/games
other test endpoints available in PostmanCollections
```

#### Individual Services
```bash
# User Service
docker cp scripts/populate-user-db.js user_service_container:/usr/src/app/
docker exec -it user_service_container node UserManagementPopulator.js

# Game Service  
docker cp scripts/populate-game-db.js game_service_container:/usr/src/app/
docker exec -it game_service_container node GameServicePopulator.js
```

### Testing
- **Postman Collections:** Available in `/PostmanCollections/` folder
- **Population Scripts:** Available in `/PopulationScripts/` folder
- **Unit Tests:** 80%+ coverage - run `npm test` in each service directory

### Requirements
- Docker & Docker Compose
- Ports 3000, 3005, 27017 available
