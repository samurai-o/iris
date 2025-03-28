# Iris — Managed Object Storage (MVP)

This Node.js service implements a basic managed object storage system using **Cloud Storage**. It supports secure, multi-tenant file uploads and downloads, with access controlled by a custom RBAC layer.

---

## Why This Implementation

This MVP focuses on:
- Core file APIs: upload, download, list, delete
- RBAC-based access control using JWT
- Metadata persistence in PostgreSQL

This covers the foundational blocks for secure and scalable object storage, while keeping the scope tight.

---

## Key Considerations

- Azure Blob is used for scalable, cost-efficient storage.
- Metadata (filename, blob URL, env ID, etc.) is stored in Postgres.
- Auth is mocked using JWTs and static roles to simulate Aptible’s RBAC model.
- Each file is stored at: `iris/<env_id>/<file_id>`

---

## Next Improvements
- Address the multiple problems with the current ACL implementation.
- Add support for building a role based access control model, to map the permissions to the roles.
- Improve the RBAC model to be fast with JWT -> Redis -> Distributed cache scaling etc.
- Recovery mechanisms using queues for failures of file upload.


---

## Challenges

- Fine-grained RBAC edge cases
- Large file uploads/downloads
- Retention policies and version control

---

## Running Locally
1. Setup postgres and a database created as `iris`.
```
docker run --name postgres-local-iris -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=iris -e POSTGRES_DB=iris -p 5432:5432 -d postgres:latest
```

2. Run the following commands to install deps (one time)
```bash
nvm use
npm install
```

3. Run the server 
```bash
nvm use
npm start
```

## File Structure

The project is organized as follows:

```
/iris
│
├── /src
│   ├── /controllers
│   │   └── fileController.js  # Handles file upload, download, and management logic
│   ├── /models
│   │   └── fileModel.js       # Defines the data schema and interactions with PostgreSQL
│   ├── /routes
│   │   └── fileRoutes.js      # Defines API endpoints and routes
│   ├── /services
│   │   └── storageService.js  # Interfaces with Azure Blob for file storage
│   └── app.js                 # Main application entry point
│
├── /config
│   └── config.js              # Configuration settings for the application
│
└── package.json               # Project metadata and dependencies
```