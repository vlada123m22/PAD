# Technologies and Communication Patterns

Our project uses a **microservice architecture**, where each service is built using the programming language that best suits its role. The main languages for our project are **Java, C#, and JavaScript**.

For communication, we rely on **REST APIs, Events, and Message Queues**. REST is the go-to for most services because it’s simple and reliable. Events come into play when several services need to be notified at the same time, while Message Queues are used to handle work that doesn’t need to happen right away.
**WebSockets** are reserved for chat in the Communication Service, since that’s where real-time interaction really matters.

---

## Services Overview

### User Management Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Handles accounts, balances, authentication, and rewards.  
- **Why JavaScript?** Node.js is well-suited for handling many concurrent requests with non-blocking I/O.  
- **Why REST?** Simple and supported across clients and services.  
- **Trade-off:** REST is not the fastest protocol, but its reliability and ecosystem support make it great for core services.  

### Game Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Controls phases, rules, win conditions, and player states.  
- **Why JavaScript?** Node.js is good for dynamic, event-driven logic.  
- **Why REST?** Ensures predictable communication with other services.  
- **Trade-off:** REST adds some delay, but game flow is not as time-sensitive as chat.  

### Shop Service – C# (.NET Core) | REST API
- **Responsibilities:** Manages items, role restrictions, and purchases.  
- **Why C#?** Strong typing and structured design fit business rules well.  
- **Why REST?** Buying and selling work naturally as HTTP requests.  
- **Trade-off:** REST is slower than event-driven communication, but transactions don't crictically need real-time speed.  

### Roleplay Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Resolves night actions like kills, heals, and investigations.  
- **Why JavaScript?** Flexible and easy to adjust when game rules change.  
- **Why REST?** Provides clarity and consistency when rezolving player actions.  
- **Trade-off:** REST may feel slower, but what really matters here is keeping things fair and consistent. 

### Town Service – JavaScript (Node.js) | REST API + Events
- **Responsibilities:** Manages locations, movements, and phase transitions.  
- **Why JavaScript?** Effective for handling many interactions between players.  
- **Why Events?** Needed to broadcast transitions (like day to night) to several services.  
- **Trade-off:** Events are harder to trace than REST, but allow scalable updates to all players at once.  

### Character Service – JavaScript (Node.js) | REST API
- **Responsibilities:** Handles disguises, inventories, and filtered player views.  
- **Why JavaScript?** Fast to implement and adapt as game logic evolves.  
- **Why REST?** Inventory checks and disguise management do not need real-time speed.  
- **Trade-off:** REST may be slower, but these updates don’t need to happen instantly.  

### Rumors Service – Java | Message Queue
- **Responsibilities:** Generates and distributes rumors when players meet.  
- **Why Java?** Strong type safety and well-established ecosystem make it reliable for implementing complex rule-based logic.  
- **Why Message Queue?** Ensures rumor creation doesn’t block the main game flow.  
- **Trade-off:** Queues add add some extra complexity, but they keep the gameplay running smoothly.  

### Communication Service – Java | WebSockets
- **Responsibilities:** Handles player chat, private channels, and sharing rumors.
- **Why Java?** Java’s reliability and ability to manage many tasks at once make it well-suited for large communication services.
- **Why WebSockets?** Enables instant, real-time chat between players.
- **Trade-off:** WebSockets are harder to scale than REST, but they are essential for live communication.

### Task Service – Java | REST API + Events
- **Responsibilities:** Assigns daily tasks and rewards.  
- **Why Java?** Reliable and well-suited for workflows that repeat.  
- **Why REST + Events?** REST for individual queries, Events for broadcasting task completions.  
- **Trade-off:** Development in Java is slower, but it provides consistency and stability.  

### Voting Service – Java | REST API
- **Responsibilities:** Collects votes, applies special rules, and reports results.  
- **Why Java?** Strong for logic that must be consistent and correct.  
- **Why REST?** Voting happens in rounds, so instant updates are not necessary.  
- **Trade-off:** REST may not be the fastest, but it works well since voting is based on turns.

---

## Overview of Trade-offs

- **JavaSCript + REST:** Very fast and lightweight, but REST is less efficient for high-frequency updates.  
- **JavaScript + Events:** Great for sending multiple updates services at once, but tricky to track what happened and when.  
- **C# + REST:** Well-structured and reliable, but harder syntax than JavaScript.  
- **Java + REST:** Very stable and consistent, which is import for voting and tasks, but slower to develop and less flexible. 
- **Java + Events:** Makes sure transitions and broadcasts (like moving from day to night) reach everyoane smoothly, but still it can be harder to debug. 
- **Java + Message Queues:** Handles side tasks smoothly like rumor distribution in the background. 
- **Java + WebSockets:** Helps with chat and real-time talk. It's perfect for instant communication, though scaling across many users is challenging.


On a bigger scale:
- **REST:** Simple, easy to debug, but adds some latency.  
- **Events:** Scalable and allows broadcasting, but harder to trace.  
- **Message Queues:** Ensure smooth gameplay, but add infrastructure complexity.  
- **WebSockets:** Real-time and necessary for communication, but harder to scale than REST.  

---

This approach ensures every service uses what it’s best at, keeping things simple, reliable, and scalable, while meeting the game’s future needs.
