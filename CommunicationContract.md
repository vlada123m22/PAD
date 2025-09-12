## User Management Service

### Register User  
**POST** /api/auth/register

**Description:** Creates a new user account and returns a JWT.  

**Payload:**  
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "displayName": "string (optional)"
}
````

**Success Response (201 Created):**

```json
{
  "user": {
    "id": 1,
    "username": "Olivia",
    "email": "olivia.olivia@email.com",
    "displayName": "Crusher",
    "createdAt": "2025-09-08T12:00:00Z"
  },
  "token": "<jwt_token>"
}
```



### Login User

**POST** /api/auth/login

**Description:** Authenticates a user with their email and password.

**Payload:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200 OK):**

```json
{
  "user_id": 1,
  "token": "<jwt_token>",
  "refresh_token": "<refresh_token>",
  "expires_in": 3600
}
```



### Get User Information

**GET** /api/users/{user_id}

**Description:** Retrieves public information for a specific user.

**Success Response (200 OK):**

```json
{
  "id": 2,
  "username": "Vlada",
  "displayName": "vlad",
  "createdAt": "2025-09-08T12:00:00Z"
}
```



### Update User Profile

**POST** /api/users/{user_id}

**Payload:**

```json
{
  "displayName": "vlada",
  "password": "greatpassword123"
}
```

**Success Response (200 OK):**

```json
{ "ok": true }
```



## Character Service

### Create Character

**POST** /api/characters

**Description:** Creates a new game character for a user with initial gold based on role.

**Payload:**

```json
{
  "userId": 1,
  "role": "Doctor"
}
```

**Success Response (201 Created):**

```json
{
  "characterId": 101,
  "userId": 1,
  "role": "Doctor",
  "level": 1,
  "gold": 80
}
```



### Get Character Info

**GET** /api/characters/{character_id}

**Success Response (200 OK):**

```json
{
  "characterId": 101,
  "userId": 1,
  "role": "Doctor",
  "level": 1,
  "gold": 80
}
```



### Update Character (Level, Gold)

**POST** /api/characters/{character_id}

**Payload:**

```json
{
  "level": 2,
  "gold": 130
}
```

**Success Response (200 OK):**

```json
{ "ok": true }
```



## Shop Service

### List Shop Items

**GET** /api/shop/items

**Success Response (200 OK):**

```json
[
  {
    "id": 1,
    "title": "Garlic",
    "description": "Protects from Vampire attack (1 use).",
    "price": 50,
    "durability": 1,
    "rolesVisible": ["Citizen", "Doctor", "Detective"]
  },
  {
    "id": 2,
    "title": "Healing Herbs",
    "description": "Doctor equipment (3 uses). Needed to save players.",
    "price": 80,
    "durability": 3,
    "rolesVisible": ["Doctor"]
  }
]
```



### Purchase Item  

**POST** /api/shop/purchase

**Description:** Attempts to buy an item for a character. The Shop Service requests the character’s gold balance from the Character Service. If sufficient funds exist, Character Service deducts the gold and the purchased item is added to the Inventory Service. Balance can never become negative.  

**Payload:**  
```json
{
  "characterId": 101,
  "itemId": 1,
  "quantity": 1
}



**Success Response (200 OK):**

```json
{
  "purchaseId": 2001,
  "itemsAdded": [
    {
      "inventoryItemId": 501,
      "itemId": 1,
      "remainingDurability": 1
    }
  ],
  "newBalance": 30
}
```

**Failure Response (400 Bad Request):**

```json
{ "error": "Insufficient funds" }
```



## Inventory Service

### List Character Inventory

**GET** /api/inventory/characters/{character_id}/items

**Success Response (200 OK):**

```json
[
  {
    "inventoryItemId": 501,
    "itemId": 1,
    "title": "Garlic",
    "boughtPrice": 50,
    "remainingDurability": 1,
    "usesLeft": 1,
    "isEquipped": false
  }
]
```



### Use Item

**POST** /api/inventory/items/{inventory_item_id}/use

**Payload:**

```json
{
  "characterId": 101,
  "context": {
    "lobbyId": 777,
    "targetCharacterId": 202
  }
}
```

**Success Response (200 OK):**

```json
{
  "inventoryItemId": 501,
  "newUsesLeft": 0,
  "usedUp": true
}
```



## Roleplay Service

### Perform Role Action

**POST** /api/roleplay/actions/perform

**Description:** Allows a character to perform a role-specific action (e.g., Mafia murder, Detective investigation, Doctor heal). Validates if the role can act at the current game state and whether required items are available.

**Payload:**

```json
{
  "lobbyId": 2001,
  "characterId": 101,
  "action": "investigate",
  "targetId": 102
}
```

**Success Response (200 OK):**

```json
{
  "actionId": 7001,
  "status": "success",
  "details": "Character 101 investigated Character 102"
}
```

**Failure Response (400 Bad Request):**

```json
{ "error": "Invalid action or requirements not met" }
```



### Get Allowed Actions

**GET** /api/roleplay/characters/{characterId}/actions

**Response (200 OK):**

```json
{
  "characterId": 102,
  "role": "Spy",
  "allowedActions": ["create-rumor"]
}
```



### Record Announcement

**POST** /api/roleplay/announcements

**Payload:**

```json
{
  "lobbyId": 21,
  "message": "The Mayor has spoken in Town Square."
}
```

**Response (201 Created):**

```json
{
  "announcementId": 91,
  "lobbyId": 21,
  "message": "The Mayor has spoken in Town Square."
}
```



## Town Service

### List Locations

**GET** /api/town/locations

**Response (200 OK):**

```json
[
  { "locationId": 1, "name": "Town Square" },
  { "locationId": 2, "name": "Speakeasy" },
  { "locationId": 3, "name": "Marketplace" }
]
```



### Move Character

**POST** /api/town/move`

**Payload:**

```json
{
  "characterId": 101,
  "locationId": 2
}
```

**Response (200 OK):**

```json
{
  "characterId": 101,
  "locationId": 2,
  "timestamp": "2025-09-08T15:30:00Z"
}
```



### Get Location Occupants

**GET** /api/town/locations/{locationId}/occupants

**Response (200 OK):**

```json
{
  "locationId": 2,
  "occupants": [
    { "characterId": 4, "name": "Andrei" },
    { "characterId": 9, "name": "Selene" }
  ]
}
```



## Character Service 

### Get Character Balance

**GET** /api/characters/{characterId}/balance

**Description:** Returns the current gold balance of a character.

**Response (200 OK):**

```json
{
  "characterId": 101,
  "balance": 80
}
```



### Deduct Gold

**POST** /api/characters/{characterId}/deduct-gold

**Description:** Deducts gold from a character’s balance. Ensures the balance cannot go below zero.

**Payload:**

```json
{
  "amount": 50
}
```

**Success Response (200 OK):**

```json
{
  "characterId": 101,
  "newBalance": 30
}
```

**Failure Response (400 Bad Request):**

```json
{ "error": "Insufficient funds" }
```



##  Rumors Service

This microservice is responsable for generating and distributing rumors based on players role and location. Rumors are not purchased, but they are produced by the system when players share location/tasks and sent to random users after the working ends. How many people will get rumours depends on the dumber of players that share a location/tasks.


### Generate Rumors 

**POST** api/rumors/generate

**Request Body**

```json
{
  "lobbyId": "124",
  "workLogs": [
    { "characterId": 1, "location": "Hospital" },
    { "characterId": 2, "location": "Hospital" },
    { "characterId": 3, "location": "Hospital" },
    { "characterId": 7, "location": "Marketplace" },
    { "characterId": 9, "location": "Hospital" },
    { "characterId": 10, "location": "Marketplace" }
  ],
  "phase": "Afternoon"
}
```

**Response Example**

```json
[
  {
    "recipientCharacterId": 1,
    "rumorText": "Someone was seen lurking around the Hospital.",
    "origin": "system"
  },
  {
    "recipientCharacterId": 9,
    "rumorText": "The Doctor was seen around the Hospital.",
    "origin": "system"
  }
]
```


### Get Rumors for Character

**GET** /rumors/{characterId}

**Response Example**

```json
[
  {
    "rumorId": 111,
    "rumorText": "The Mayor was seen around the Marketplace.",
    "origin": "system",
    "timestamp": "2025-09-11T20:10:00Z"
  }
]
```




##  Communication Service

This microservice is reponsible for communication between the players. A global chat for all the players during the voting and a private chat for Mafias during the night.

##  Communication Contract

### Send Message (Global or Location chat)

**POST** /api/chat/send

**Request Body**

```json
{
  "senderId": 1,
  "channelType": "global",
  "message": "I think the Doctor is suspicious!"
}
```

**Response Example**

```json
{
  "status": "sent",
  "channelType": "global",
  "timestamp": "2025-09-11T19:42:00Z"
}
```



### WebSockets

### Global Chat

**WS** `/ws/chat/global/{lobbyId}`

Message format:

```json
{
  "fromCharacterId": 7,
  "text": "Vote for the Vampire!",
  "timestamp": "2025-09-11T19:43:00Z"
}
```


### Mafia Private Chat

**WS** `/ws/chat/mafia/{lobbyId}`

Accessible only to Mafia members.



## Task Service

### Assign Tasks

**POST** /api/tasks/assign

**Payload:**

```json
{
  "lobbyId": 201
}
```

**Response (200 OK):**

```json
{
  "assignedTasks": [
    { "taskId": 31, "characterId": 9, "location": "Forest", "reward": 50 },
    { "taskId": 32, "characterId": 12, "location": "Hospital", "reward": 50 }
  ]
}
```



### Complete Task

**POST** /api/tasks/{taskId}/complete

**Payload:**

```json
{ "characterId": 5 }
```

**Response (200 OK):**

```json
{
  "taskId": 31,
  "characterId": 5,
  "reward": 50,
  "status": "completed"
}
```



## Voting Service

### Cast Vote

**POST** /api/voting/cast

**Payload:**

```json
{
  "lobbyId": 201,
  "voterId": 11,
  "targetId": 1
}
```

**Response (200 OK):**

```json
{
  "voteId": 61,
  "status": "recorded"
}
```



### Get Voting Results

**GET** /api/voting/results/{lobbyId}

**Response (200 OK):**

```json
{
  "lobbyId": 201,
  "results": [
    { "targetId": 1, "votes": 9 },
    { "targetId": 11, "votes": 4 },
    { "targetId": 7, "votes": 1 },
    { "targetId": 13, "votes": 1 }
  ],
  "eliminated": 1
}
```


