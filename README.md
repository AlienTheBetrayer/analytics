# Analytics

## Overview
**A brief overview of the application, not all features were displayed, there's more to the application**

---

## Features:
- [Home](#Home)
- [Messenger](#Messenger)
- [Noteboard](#Noteboard)
- [Posts](#Posts)
- [Dashboard](#Dashboard)
- [Notifications](#Notifications)
- [Contact](#Contact)
- [Profile](#Profile)
- [Search](#Search)
- [Auth](#Auth)
- [Theme](#Theme)

--- 

## Tech Stack

- **Frontend & Backend**
  - React
  - Next.js
  - TypeScript

- **State Management & Data**
  - Normalized caching
  - Custom strongly-typed `useQuery()` system (SWR)
  - Zustand with state synchronization

- **Authentication & API**
  - JWT-based authentication (refreshing + roles/permissions + encryption)
  - 60+ RESTful API endpoints
  - Real-time WebSocket communication
  - NPM package to gather analytics

- **UI & Styling**
  - Tailwind CSS
  - Three.js for 3D graphics
  - Framer Motion for animations

- **Custom UI Toolkit**
  - Fully accessible modals, tooltips, and popovers
  - Custom buttons, inputs, and checkboxes
  - Elegant ripple effects
  - Dark/light theme support

- **Utilities & Patterns**
  - Promise handler with deduplication and race condition management
  - Robust notifications system
  - Caching + SWR

---

## Home
Stellar grid view:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/home/home1.png)

Modal:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/home/home2.png)

---

## Messenger
View:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages1.png)

Virtualized messages list + Context menu:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages2.png)

Invitation creation: (+image)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages3.png)

Invitation view:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages4.png)

Forwarding messages:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages5.png)

Conversation members + roles:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages6.png)

Member editing (permissions + role + mute):
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages7.png)

Conversation editing:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages8.png)

Messages selection (copy + delete):
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages9.png)

Group creation: (image + realtime friend list)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/messages/messages10.png)

---

## Noteboard
- **Notes conversation allows both messages and a noteboard**

View:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/noteboard/noteboard1.png)

Elements: (ability to edit / delete / pin)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/noteboard/noteboard2.png)

---

## Posts
View: (sort + filter + display type)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/posts/posts1.png)

Expanded view:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/posts/posts2.png)

Comments: (likes + dislikes + editing)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/posts/posts3.png)

Creation / editing:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/posts/posts4.png)

---

## Dashboard
View: (gathered from other applications via an NPM SDK)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/dashboard/dashboard1.png)

Emulation (fake events):
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/dashboard/dashboard2.png)

---

## Notifications
View: (+advanced filtering):
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/notifications/notifications1.png)

--- 

## Contact

Message sending + preview:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/contact/contact1.png)

Admin panel:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/contact/contact2.png)

Admin panel messages list: (other users' feedback)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/contact/contact3.png)

---

## Profile
View: (profile info + three most recent posts)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/profile/profile1.png)

Security tab: (authentication sessions + ability to revoke)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/profile/profile2.png)

Friends tab: (incoming / outcoming requests + friend list)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/profile/profile3.png)

---

## Search
Users: (+three recent posts)
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/search/search1.png)

---

## Theme
Messages:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/theme/theme1.png)

Home:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/theme/theme2.png)

Dashboard:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/theme/theme3.png)

---

## Auth
Login / Register form:
![](https://raw.githubusercontent.com/AlienTheBetrayer/analytics/refs/heads/main/readme/images/auth/auth1.png)
