# DB Design

## User Management Service
### users
- id (PK)
- email (unique)
- username (unique)
- hashed_password
- device_info
- location_info
- created_at
- updated_at

---

## Game Service
### Lobbies
- lobby_id (PK)
- max_players
- current_state (0-pending, 1-morning, 2-afternoon, 3-night, 4-voting, 5-finished)
- created_at
- closed_at (if NULL then is still active)
- updated_at

### Characters
- character_id (PK)
- lobby_id (FK lobbies)
- user_id (FK users)
- role_id (FK roles)
- currency_amount
- killed_at (if NULL then was never killed)
- vote_power (int, e.g., Mayor = 2, others = 1)
- created_at
- updated_at

### Roles (dimension table)
- role_id (PK)
- name (e.g., Mafia, Doctor, Detective, Spy, Citizen, Vampire, TownDrunk, Mayor)
- initial_gold (matches start money per rules)
- created_at
- updated_at

---

## Shop Service
### Shops
- id (PK)
- name
- description
- created_at
- updated_at

### Items
- id (PK)
- name
- description
- price
- max_uses (-1 = unlimited)
- role_restriction (nullable)
- created_at
- updated_at

### Items_Shops
- id (PK)
- item_id (FK items)
- shop_id (FK shops)
- name
- stock_quantity
- price

### Items_Roles
- id (PK)
- item_id (FK items)
- role_id (FK roles)
- created_at
- updated_at

### Price_History
- id (PK)
- shop_item_id (FK items_shops)
- price
- effective_from
- effective_to (nullable)
- created_at
- updated_at

### User_Purchases
- id (PK)
- user_id (FK users)
- shop_item_id (FK items_shops)
- purchase_datetime
- quantity
- price_paid
- created_at
- updated_at

---

## RolePlay Service
### Ability
- id (PK)
- name
- description
- date_created
- date_updated

### Roles_Abilities
- id (PK)
- role_id (FK roles)
- ability_id (FK abilities)
- date_created
- date_updated

### User_Lobby_Ability
- id (PK)
- user_id (FK users)
- ability_id (FK abilities)
- lobby_id (FK lobbies)
- ability_level
- date_created
- date_updated

### Actions
- action_id (PK)
- action_name
- action_description
- created_date
- updated_date

### Action_Role
- id (PK)
- executor_role_id (FK roles)
- target_role_id (FK roles)
- action_id (FK actions)
- created_date
- updated_date

### Action_History
- action_history_id (PK)
- lobby_id (FK lobbies)
- location_id (FK locations)
- user_id (FK users)
- action_id (FK actions)
- target_user_id (FK users, nullable)
- action_time (timestamp)
- success_status (boolean)
- date_created
- date_updated

---

## Town Service
### Locations (dimension table)
- location_id (PK)
- name
- description
- created_at (timestamp)
- updated_at (timestamp)

### Location_Lobby
- location_lobby_id (PK)
- location_id (FK locations)
- lobby_id (FK lobbies)
- created_at (timestamp)
- updated_at (timestamp)

### Character_Location
- character_location_id (PK)
- character_id (FK characters)
- location_id (FK locations)
- time_entered
- time_left (nullable, if null, is still there)
- created_at (datetime)
- updated_at (datetime)

---

## Character Service
### Character_Item
- character_item_id (PK)
- character_id (FK characters)
- item_id (FK items)
- quantity
- uses_left
- acquired_at
- created_at
- updated_at

---

## Rumor Service
### Rumors
- rumor_id (PK)
- rumor_name
- rumor_description
- created_at
- updated_at

### Rumor_Role
- rumor_id (PK)
- initiator_role_id (FK roles)
- target_role_id (nullable, FK roles)
- receiver_role_id (FK roles)
- created_at
- updated_at

### Rumor_History
- rumor_history_id (PK)
- rumor_id (FK rumors)
- action_id (FK actions, if rumor is false then action_id = -1)
- location_id (FK locations)
- receiver_id (FK users)
- date_created
- date_received
- date_updated

---

## Communication Service
### Chats
- id (PK)
- name
- description (optional)
- created_at
- updated_at

### Chat_User
- id (PK)
- chat_id (FK chats)
- user_id (FK users)
- description
- created_at
- updated_at

---

## Tasks Service
### Tasks (dimension table)
- task_id (PK)
- name
- description
- max_assignees_per_location (int, e.g., 5)
- payment_amount
- created_at
- updated_at

### Task_Role_Location (dimension table)
- task_role_location_id (PK)
- task_id (FK tasks)
- role_id (FK roles)
- location_id (FK locations)
- created_at
- updated_at

### Tasks_History (fact table)
- task_character_id (PK)
- character_id (FK characters)
- task_id (FK tasks)
- assigned_at (datetime)
- completed_at (datetime, if NULL then not completed yet)
- created_at
- updated_at

---

## Voting Service
### Votes
- vote_id (PK)
- lobby_id (FK lobbies)
- voter_character_id (FK characters)
- voted_character_id (FK characters)
- voting_round (int)
- weight (int, from voter - e.g., mayor double vote)
- voted_at
- created_at
- updated_at
