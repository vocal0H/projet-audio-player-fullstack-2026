CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
);




CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    artist VARCHAR(255),
    file_path TEXT
);

INSERT INTO tracks (title, artist, file_path)
VALUES
('idm', 'Pixabay', '/app/media/mp3/evgeny_bardyuza-everything-feels-new.mp3'),
('idm2', 'Pixabay', '/app/media/mp3/musinova-playful-glitch-idm-electronic.mp3');




CREATE TABLE history (
    id SERIAL PRIMARY KEY,
    track_id INT REFERENCES tracks(id),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);