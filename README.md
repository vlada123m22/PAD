# PAD

### Github workflow description

#### Branches and branches naming conventions

- main - the main branch of the project
- develop - the development branch, for testing
- **naming convention for other branches:** `<issue-number>-<issue-name>`

#### Pushing

- pushing to develop and other branches: unrestricted
- pushing to main: not allowed

#### Pull requests & Merging strategy:

- A PR needs one approval before being merged
- Merging strategy: squash and merge
- No pull requests to main will be approved, until the changes are tested in develop

## Service Boundaries

This project implements a multiplayer Mafia game with a **microservice architecture**, designed around strict separation of responsibilities. Each service owns its own logic and data, ensuring modularity, scalability, and independence. The rules of the game — phases, roles, items, tasks, rumors, and win conditions — are distributed across services to prevent a single monolith from becoming overloaded.

---

### User Management Service

This service is the source of truth for player identity and economic balances.

- Initializes player wallets (80g for Mafia, Doctors, Detectives; 50g for others).
- Tracks balances and validates all sales of items`.
- Issues 50g rewards for each completed task.
- Handles account creation, authentication, and persistent identity.

It **does not know game rules or phases**. Other services (Shop, Tasks, Game) must go through it when money changes hands.

---

### Game Service

The Game Service orchestrates the overall loop and ensures compliance with **phases and win conditions**.

- Enforces the four phases: **Morning, Afternoon, Night, Voting**.
- In **Morning**: triggers task assignment and grants marketplace access.
- In **Afternoon**: allows tasks, marketplace, or apothecary visits.
- In **Night**: triggers night time activities.
- In **Voting**: manages voting results and announces them.
- Keeps track of all players in the lobby and their alive status and role.
- Initiates voting by providing the list of people that can be voted out.
- Declares winners: Mafia/Vampire when they equal or outnumber others, Town if all threats are eliminated, Town Drunk if voted out.

It depends on other services for detailed outcomes (Voting Service for tallies, Roleplay Service for action resolution, Rumors Service for gossip).

---

### Shop Service

The Shop (including the Apothecary) governs the item economy.

- Generates randomized daily goods per player.
- Restricts items by role (e.g., **Poison** for Mafia, **Healing Herbs** for Doctor, **Rumor Scroll** for Spy).
- Enforces one-time use limits or multi-use item rules (e.g., **Garlic** protects once, **Healing Herbs** has 3 uses).
- Handles currency operations through User Management.

The Shop knows nothing about how items are later used; it only sells them.

---

### Roleplay Service

This service enforces **nighttime actions and item effects**, resolving interactions fairly and in order.

- Resolves kills, heals, investigations, and vampire feeds.
- Enforces strict action sequence during night time: Detective → Spy → Vampire → Mafia → Doctor.
- Applies item effects (Garlic, Silver Dagger, Cloak, Vest, etc.).
- Records outcomes (which are then announced by Game Service but exposes only filtered results (e.g., Detective sees Mafia/not Mafia).

It is the **rule engine**, but not the storyteller. Game Service decides when outcomes are revealed.

---

### Town Service

The Town Service manages **locations and schedules**, grounding all tasks and rumors.

- Defines valid locations: Town Square, Speakeasy, Marketplace, Apothecary, Forest, Hospital, Post Office, Warehouse, Back Alley.
- Assigns tasks with respect to role and location.
- Applies **Boots of Speed** effects, allowing two tasks.
- Tracks movement between locations and phase transitions.

Other services (Tasks, Rumors, Roleplay) rely on Town Service to validate presence and constraints.

---

### Character Service

This service handles how players **appear to others** and manages their personal inventories.

- Stores disguises.
- Tracks purchased items.
- Provides filtered identity views: a cloaked player appears anonymous, a disguised player appears as a different role.
- Shields or reveals information based on investigative tools which is then revealed to the player through Game Service (e.g., Spyglass, Disguise Kit).

Game mechanics like deaths or voting visibility still belong to the Game Service.

---

### Rumors Service

The Rumors Service powers the **deduction and misinformation** system.

- Generates rumors when 2+ players share a location.
- Applies rules:
  - 2–3 players: one randomly chosen, 60% chance to hear about another.
  - 4–5 players: two chosen, each with 60% chance.
  - Speakeasy: 40% chance to hear about _any_ player.
- Supports **Spy’s Rumor Scroll** for fake rumors.
- Encodes role-based rumor templates (Detective seen, Doctor seen, someone lurking, someone with cloak, etc.).

Rumors are passed through the Communication Service but only generated here.

---

### Communication Service

This service owns all **chat and messaging channels**.

- Manages global chat during voting.
- Provides Mafia-only private chats.
- Relays rumors.
- Handles Mafia/Spy secret messages (with chance of interception if others are nearby).

It has no knowledge of game outcomes; it just enforces communication boundaries.

---

### Task Service

The Task Service governs daily objectives tied to roles and locations.

- Assigns **role-specific tasks** each morning.
- Validates completions and issues rewards (communication with User Management) (50g each).
- Ensures to not assign a task to more than 5 people in one location.
- Supports special Mafia/Spy tasks (e.g., “Meet” tasks with secret message exchange).
- Coordinates with Town Service for valid placement and with User Management for payouts.

It does not resolve kills, or votes — only tasks.

---

### Voting Service

The Voting Service resolves **democratic decisions** during the Voting phase.

- Collects and tallies votes.
- Applies special rules: Mayor’s vote counts double.
- Passes results to the Game Service, which enforces consequences (execution, Drunk win condition, etc.).

It owns vote data but not the broader consequences.

---
