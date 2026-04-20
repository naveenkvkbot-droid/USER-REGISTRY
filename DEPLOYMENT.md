# User Registry - Deployment Guide

## Overview
This document provides comprehensive information about deploying the User Registry application.

## Prerequisites
- Docker (version 20.10+)
- Docker Compose (integrated with Docker on most systems)
- Node.js 20+ (for local development)
- PostgreSQL 16 with pgvector extension

## Build Status
✅ **All systems operational**
- Linting: PASSED
- TypeScript Compilation: PASSED
- Docker Image Build: PASSED
- Configuration Validation: PASSED

## Docker Image Information
- **Image Name**: `user-registry:latest`
- **Size**: 499MB
- **Base Image**: `node:20-alpine`
- **Port**: 3100

## Quick Start with Docker Compose

### 1. Start All Services
```bash
docker compose up -d
```

This will start:
- **PostgreSQL Database** (pgvector:pg16) on port 5432
  - Database: `user_registry`
  - User: `postgres`
  - Password: `dev_password`

- **Application** (Node.js/NestJS) on port 3100
  - Automatically waits for database to be healthy
  - Runs in production mode

### 2. Verify Services are Running
```bash
docker compose ps
```

Expected output:
```
NAME                           COMMAND                  SERVICE      STATUS
user-registry-app-1           "npm run start:prod"     app          Up
user-registry-postgres-1      "docker-entrypoint..."   postgres     Up (healthy)
```

### 3. Check Application Health
```bash
curl http://localhost:3100/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-04-19T21:15:30.123Z"
}
```

### 4. Stop Services
```bash
docker compose down
```

### 5. Stop and Remove Data
```bash
docker compose down -v
```

## Environment Configuration

### Application Environment Variables
Located in `.env` file:

```
DATABASE_HOST=postgres          # PostgreSQL host (in Docker)
DATABASE_PORT=5432             # PostgreSQL port
DATABASE_NAME=user_registry    # Database name
DATABASE_USER=postgres         # Database user
DATABASE_PASSWORD=dev_password # Database password
PORT=3100                      # Application port
LOG_LEVEL=info                # Logging level
```

### Production Considerations

**Security Recommendations:**
1. Change `POSTGRES_PASSWORD` and `DATABASE_PASSWORD` in production
2. Use environment-specific `.env` files
3. Store secrets in a secure secrets management system (AWS Secrets Manager, Vault, etc.)
4. Enable HTTPS/TLS
5. Use strong PostgreSQL credentials

**Performance Recommendations:**
1. Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Scale application containers based on load
3. Enable connection pooling
4. Use CDN for static assets
5. Implement caching strategies

## Docker Compose Features

### Health Checks
- PostgreSQL has health checks configured
- Application waits for database to be healthy before starting
- Automatic retry logic (5 retries, 5s timeout)

### Volumes
- `postgres_data`: Persistent PostgreSQL data volume
  - Ensures data survives container restarts
  - Can be backed up independently

### Networking
- Services communicate via Docker internal network
- Port mappings allow external access:
  - Application: `:3100`
  - PostgreSQL: `:5432`

## API Endpoints

### Health Check
```
GET /health
```

### Users
```
PATCH /users/:id
GET /users/:id/summary
```

### Face Embeddings
```
POST /face-embeddings/search
POST /face-embeddings/register
```

### Conversations
```
POST /conversations
GET /conversations/:userId
```

## Troubleshooting

### Application Won't Start
```bash
docker compose logs app
```

Common issues:
- Database not ready: Check PostgreSQL logs
- Port already in use: Change port mapping in docker-compose.yml
- Missing environment variables: Verify .env file

### Database Connection Issues
```bash
docker compose logs postgres
docker compose exec postgres psql -U postgres -d user_registry
```

### Clear Everything and Restart
```bash
docker compose down -v
docker compose up -d
```

## Production Deployment

### Kubernetes Deployment
For Kubernetes deployment, create:
1. Namespace: `user-registry`
2. ConfigMap: Store environment configuration
3. Secret: Store sensitive credentials
4. StatefulSet: PostgreSQL with persistent storage
5. Deployment: Application replicas
6. Service: Internal/External access

### Docker Swarm
```bash
docker stack deploy -c docker-compose.yml user-registry
```

### Manual Deployment
1. Build image: `docker build -t user-registry:v1.0.0 .`
2. Push to registry: `docker push your-registry/user-registry:v1.0.0`
3. Run container with proper mounts and networks
4. Configure reverse proxy (Nginx, Traefik, etc.)
5. Setup monitoring and logging

## Monitoring & Logging

### Docker Logs
```bash
# Application logs
docker compose logs app -f

# Database logs
docker compose logs postgres -f

# All services
docker compose logs -f
```

### Health Monitoring
- Implement application metrics (Prometheus)
- Database monitoring and backups
- Container resource monitoring
- Log aggregation (ELK Stack, Datadog, etc.)

## Backup & Recovery

### Database Backup
```bash
docker compose exec postgres pg_dump -U postgres user_registry > backup.sql
```

### Database Restore
```bash
docker compose exec -T postgres psql -U postgres user_registry < backup.sql
```

### Volume Backup
```bash
docker run --rm -v user-registry_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres_data.tar.gz -C /data .
```

## Updates & Maintenance

### Update Application
1. Pull latest code
2. Rebuild image: `docker build -t user-registry:latest .`
3. Update docker-compose.yml if needed
4. Restart services: `docker compose restart app`

### Database Migrations
Currently no migration system configured. For production:
1. Implement TypeORM migrations
2. Create migration files
3. Run migrations during deployment
4. Maintain backup before migrations

## Rollback Procedures

### Quick Rollback
```bash
docker compose down
docker pull user-registry:previous-version
docker compose up -d
```

### Data Recovery
- PostgreSQL data persists in volumes
- Can restore from backups using pg_restore
- Maintain backup schedule for production

## Performance Metrics

### Current Configuration
- Database: 1 PostgreSQL instance
- Application: 1 container instance
- Memory: ~500MB application + ~256MB PostgreSQL
- Disk: 499MB image + data volume

### Scaling Options
1. Horizontal: Multiple application replicas with load balancer
2. Vertical: Increase container resource limits
3. Database: Read replicas, sharding for large datasets

## Support & Maintenance

For issues or questions:
1. Check Docker logs
2. Verify environment variables
3. Confirm database connectivity
4. Review application configuration
5. Check Docker system resources

---

**Last Updated**: 2026-04-19
**Version**: 1.0.0
