# Test Series BE

> Backend for Test Series application (Express + MongoDB + Redis)

This repository provides the backend API for a test series application. It uses Node.js, Express, MongoDB (Mongoose), and Redis for caching. Swagger UI is included for API documentation.

## Features

- Express server with JSON API
- MongoDB via Mongoose
- Redis caching
- File uploads served from `/uploads`
- Swagger API documentation at `/api-docs`

## Requirements

- Node.js (16+ recommended)
- npm
- MongoDB (local or remote)
- Redis (optional but recommended for caching)
- Docker (optional, recommended for running Redis/RedisInsight)

## Quick start

1. Clone the repo and install dependencies:

```powershell
# from project root
npm install
```

2. Create a `.env` file in the project root (copy from `.env.example` if present) and set the following variables:

- PORT - port to run the server (default 5000)
- MONGO_URI - MongoDB connection string (default: mongodb://localhost:27017/test-series)
- JWT_SECRET - secret used to sign JWTs
- REDIS_URL - optional Redis connection URL (e.g. redis://localhost:6379)
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and other oauth/mail settings used by the project if applicable

Example `.env`:

```text
PORT=5000
MONGO_URI=mongodb://localhost:27017/test-series
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
# other env vars used by this project
```

3. Start the server in development mode:

```powershell
npm run dev
```

The server will start, connect to MongoDB, and (if `REDIS_URL` is set) connect to Redis. Swagger UI will be available at `http://localhost:5000/api-docs`.

## File uploads

Uploaded files are served statically from the `public/uploads` directory and mounted at `/uploads`. In `server.js` the static route is configured like:

```text
/uploads -> public/uploads
```

So an uploaded file `public/uploads/courses/1760935766014-624432578.jpg` is available at:

```
http://localhost:5000/uploads/courses/1760935766014-624432578.jpg
```

## Redis & RedisInsight

If you want to run Redis locally with Docker, use:

```powershell
# Run Redis server
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

Connect the app by setting `REDIS_URL=redis://localhost:6379` in your `.env`.

To run RedisInsight (web UI for Redis) using Docker, run:

```powershell
# Run RedisInsight (UI) on port 8001
docker run -d --name redisinsight -p 8001:8001 redis/redisinsight:latest
```

Then open the RedisInsight UI at `http://localhost:8001` in your browser and add a connection to your Redis server (host `host.docker.internal` or `localhost` depending on your Docker setup). The command you provided in your message is correct; this repository README includes that exact command.

Notes about connecting RedisInsight to Docker-hosted Redis on Windows:

- When Redis runs in a Docker container and RedisInsight runs in a different container, use the Docker network or `host.docker.internal` to connect from RedisInsight to the Redis container. If you started both containers with default network settings on the same host, `host.docker.internal` should work.
- Alternatively, map Redis container to the host port (see `-p 6379:6379` above) and connect to `localhost:6379` from RedisInsight running on the host.

## API documentation

Swagger UI is mounted at `/api-docs`. Start the server and visit `http://localhost:5000/api-docs` to browse the API, see available endpoints, and try calls from the UI.

## Development notes

- Start in dev mode: `npm run dev` (uses `nodemon`)
- Linting and tests: none configured by default; consider adding `eslint` and a test framework for quality checks

## Troubleshooting

- MongoDB connection errors: ensure your `MONGO_URI` is reachable, and that MongoDB is running.
- Redis connection errors: check `REDIS_URL` and ensure Redis is running. The app logs Redis connect/ error events to the console.
- Docker on Windows: if Docker containers can't talk to host `localhost`, try `host.docker.internal` as the hostname.

## Files of interest

- `server.js` - app entrypoint
- `src/config/db.js` - MongoDB connection
- `src/config/redisClient.js` - Redis client
- `src/routes` - API routes

## License

ISC
