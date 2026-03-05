
refresh page
↓
GET /stream
↓
track A

refresh page
↓
GET /stream
↓
track B


A
B
A
B
A
B


Track1
↓
Track2
↓
Track3
↓
Track4
↓
jamais d'arrêt



Navigateur (React)
       │
       │ clique PLAY
       ▼
GET http://localhost:5000/stream
       │
       ▼
Node.js (Express)
       │
       │ récupère les tracks dans PostgreSQL
       ▼
SELECT * FROM tracks
       │
       ▼
Node choisit une track
()
       │
       ▼
fs.createReadStream(mp3)
       │
       ▼
audio envoyé au navigateur
       │
       ▼
le navigateur lit le mp3