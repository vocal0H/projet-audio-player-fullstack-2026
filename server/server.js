import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import pkg from "pg";
import redis from "redis";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "radio",
  host: "postgres",
  database: "radio_db",
  password: "radio123",
  port: 5432,
});

const redisClient = redis.createClient({
  url: "redis://redis:6379",
});

await redisClient.connect();

app.get("/stream", async (req, res) => {
  const result = await pool.query("SELECT * FROM tracks");
  const tracks = result.rows;

  if (!tracks.length) return res.send("No tracks");

  const random = tracks[Math.floor(Math.random() * tracks.length)];

  await pool.query("INSERT INTO history (track_id) VALUES ($1)", [random.id]);

  const filePath = path.resolve(random.file_path);

  res.setHeader("Content-Type", "audio/mpeg");
  fs.createReadStream(filePath).pipe(res);
});

app.get("/history", async (req, res) => {
  const result = await pool.query(`
    SELECT tracks.title, tracks.artist 
    FROM history
    JOIN tracks ON history.track_id = tracks.id
    ORDER BY history.played_at DESC
    LIMIT 10
  `);
  res.json(result.rows);
});

app.listen(5000, () => console.log("Server running on port 5000"));