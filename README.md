# Mafia Platform
## Github workflow description

#### Branches and branches naming conventions

- main - the main branch of the project
- develop - the development branch, for testing
- **naming convention for other branches:** `<issue-number>-<issue-name>`

#### Pushing

- pushing to develop and other branches: unrestricted
- pushing to main: not allowed

#### Pull requests & Merging strategy:

- A PR needs one approval before being merged
- Merging strategy: squash and merge, merge commit, rebase
- No pull requests to main will be approved, until the changes are tested in develop

## Team Services

### DockerHub Services
- **User Management Service:** `nadea39/user-management-service:1.4` (Port 3000)
- **Game Service:** `nadea39/gameservice:v1.0.0` (Port 3005)

### Quick Start
```bash
# Start all services
docker-compose -f docker-compose.yml up -d

# Test endpoints
curl http://localhost:3000/users
curl http://localhost:3005/games
```

#### Individual Services
```bash
# User Service
docker cp scripts/populate-user-db.js user_service_container:/usr/src/app/
docker exec -it user_service_container node populate-user-db.js

# Game Service  
docker cp scripts/populate-game-db.js game_service_container:/usr/src/app/
docker exec -it game_service_container node populate-game-db.js
```

### Testing
- **Postman Collections:** Available in `/PostmanCollections/` folder
- **Population Scripts:** Available in `/PopulationScripts/` folder
- **Unit Tests:** 80%+ coverage - run `npm test` in each service directory

### Requirements
- Docker & Docker Compose
- Ports 3000, 3005, 27017 available