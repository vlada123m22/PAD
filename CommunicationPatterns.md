# Technologies and Communication Patterns

This project uses a **microservice architecture**, where each service is written in the programming language that best fits its role. The main languages are **Go, Java, C#, and JavaScript**.

For communication, we use **REST APIs, Events, and Message Queues**. REST is the standard choice for most services because it is simple and reliable. Events are used when multiple services need to be notified at once. Message Queues are used where asynchronous processing is important.  
**WebSockets are used only for chat in the Communication Service**, where real-time interaction is essential.

---

## Services Overview

### User Management Service – Go | REST API
- **Responsibilities:** Handles accounts, balances, authentication, and rewards.  
- **Why Go?** Fast, lightweight, and efficient for services with many small requests.  
- **Why REST?** Simple and widely supported.  
- **Trade-off:** REST is not the fastest protocol, but its reliability makes it a strong fit for core services.  

### Game Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Controls phases, rules, win conditions, and player states.  
- **Why JavaScript?** Node.js is good for dynamic, event-driven logic.  
- **Why REST?** Ensures predictable communication with other services.  
- **Trade-off:** REST adds some delay, but game orchestration is not as time-sensitive as chat.  

### Shop Service – C# (.NET Core) | REST API
- **Responsibilities:** Manages items, role restrictions, and purchases.  
- **Why C#?** Strong typing and structured design fit business rules well.  
- **Why REST?** Buying and selling work naturally as HTTP requests.  
- **Trade-off:** REST is slower than event-driven communication, but transactions are not real-time critical.  

### Roleplay Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Resolves night actions like kills, heals, and investigations.  
- **Why JavaScript?** Flexible and easy to adjust when game rules change.  
- **Why REST?** Provides clarity and consistency for action resolution.  
- **Trade-off:** REST may feel slower, but fairness and consistency matter more than raw speed here.  

### Town Service – JavaScript (Node.js) | REST API + Events
- **Responsibilities:** Manages locations, movements, and phase transitions.  
- **Why JavaScript?** Effective for handling many interactions between players.  
- **Why Events?** Needed to broadcast transitions (like day → night) to several services.  
- **Trade-off:** Events are harder to trace than REST, but allow scalable updates to all players at once.  

### Character Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Handles disguises, inventories, and filtered player views.  
- **Why JavaScript?** Fast to implement and adapt as game logic evolves.  
- **Why REST?** Inventory lookups and disguise management do not need real-time speed.  
- **Trade-off:** REST may be slower, but these updates are not time-critical.  

### Rumors Service – JavaScript (Node.js) | Message Queue
- **Responsibilities:** Generates and distributes rumors when players meet.  
- **Why JavaScript?** Simple and flexible for random generation logic.  
- **Why Message Queue?** Ensures rumor creation doesn’t block the main game flow.  
- **Trade-off:** Queues add infrastructure complexity, but they keep gameplay smooth.  

### Communication Service – JavaScript (Node.js) | WebSockets
- **Responsibilities:** Provides player chat, private channels, and rumor relays.  
- **Why JavaScript?** Node.js is designed for handling many simultaneous connections.  
- **Why WebSockets?** Enables instant, real-time chat between players.  
- **Trade-off:** WebSockets are harder to scale than REST, but they are essential for live communication.  

### Task Service – Java | REST API + Events
- **Responsibilities:** Assigns daily tasks and rewards.  
- **Why Java?** Reliable and well-suited for workflows that repeat.  
- **Why REST + Events?** REST for individual queries, Events for broadcasting task completions.  
- **Trade-off:** Development in Java is slower, but it ensures consistency and stability.  

### Voting Service – Java | REST API
- **Responsibilities:** Collects votes, applies special rules, and reports results.  
- **Why Java?** Strong for logic that must be consistent and correct.  
- **Why REST?** Voting happens in rounds, so instant updates are not necessary.  
- **Trade-off:** REST may not be the fastest, but it fits the turn-based nature of voting.  

---

## Overview of Trade-offs

- **Go + REST:** Very fast and lightweight, but REST is less efficient for high-frequency updates.  
- **JavaScript + REST/Events:** Great for dynamic game logic and flexible workflows, but less efficient at scale.  
- **C# + REST:** Well-structured and reliable, but heavier syntax than JavaScript.  
- **Java + REST/Events:** Very stable, but slower to develop and less flexible.  
- **REST:** Simple, easy to debug, but adds some latency.  
- **Events:** Scalable and allow broadcasting, but harder to trace.  
- **Message Queues:** Ensure smooth gameplay, but add infrastructure complexity.  
- **WebSockets (only chat):** Real-time and necessary for communication, but harder to scale than REST.  

---

This setup allows each service to use the **best tool for its role**, balancing **simplicity, reliability, and scalability**, while supporting the long-term needs of the game.
