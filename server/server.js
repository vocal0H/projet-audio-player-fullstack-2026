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

redisClient.connect();

let currentTrackIndex = 0;

app.get("/stream", async (req, res) => {
  try {

    const result = await pool.query("SELECT * FROM tracks ORDER BY id");
    const tracks = result.rows;

    if (!tracks.length) {
      return res.status(404).send("No tracks available");
    }

    const track = tracks[currentTrackIndex];

    currentTrackIndex++;

    // L’index se réinitialise à zéro seulement après avoir atteint la fin :
    if (currentTrackIndex >= tracks.length) {
      currentTrackIndex = 0;
    }

    await pool.query(
      "INSERT INTO history (track_id) VALUES ($1)",
      [track.id]
    );

    const filePath = path.resolve(track.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Audio file not found");
    }

    res.setHeader("Content-Type", "audio/mpeg");

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
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