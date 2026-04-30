# Dicero Bot

### HOW TO START THE BOT

1. Create .env file at root directory based on the .env.dist
2. Execute those commands in your terminal to start the bot

```sh
pnpm i
pnpm dev
```

### Tracking Roles Format:

```json
{
	"roles": [
		"1339255410435297311", // Vocal VIP
		"1300920821765771329", // Emojis
		"1290721300163067935", // Content Creator
		"1336026802589798420", // Trial Chat Mod
		"1316886619533611168", // Chat Mod
		"1291188097291124746", // Community Mod
		"1291051249436856401", // Bot
		"1319622080920031302" // Administrator (display role)
	],
	"channel": "1308723701201502250"
}
```

## Database Schema (PostgreSQL)

This project uses a PostgreSQL database (e.g., Neon) for thread and feedback management. Apply the following schema to your database:

```sql
-- Table: threads
CREATE TABLE threads (
    "id" SERIAL PRIMARY KEY,
    "thread_id" VARCHAR(32) NOT NULL UNIQUE,
    "channel_id" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "keywords" TEXT[]
);

-- Table: channel_keywords
CREATE TABLE channel_keywords (
    "id" SERIAL PRIMARY KEY,
    "channel_id" VARCHAR(32) NOT NULL,
    "keyword" VARCHAR NOT NULL,
    "regex" TEXT
);
```

**How to apply:**

- Run the above SQL in your PostgreSQL database (e.g., using Neon SQL editor or `psql`).
- Update your bot's configuration to connect to the database.

## Database Configuration

Set the following environment variables in your `.env` file for Neon/PostgreSQL connection and channel configuration:

```
DB_CONNECTION_STRING=your_neon_postgres_connection_string
```
