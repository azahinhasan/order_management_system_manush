# order_management_system_manush

## Getting Started

### Clone the Repository
Clone the project to your local machine:
```bash
git clone https://github.com/azahinhasan/order_management_system_manush.git
```

---

## Running the Project

### Option 1: Run with Docker (Recommended)
Navigate to the project folder and run the following command(make sure docker is running on the system):
```bash
docker-compose up --build
```
or
```bash
docker compose up --build
```
Docker will handle all dependencies, including PostgreSQL and Node.js, making setup simpler.

- The frontend will be accessible at `http://localhost:3179`.
- The backend server will be accessible at `http://localhost:3010`.
- The DB will be accessible at `http://localhost:5432`.
- The redis will be accessible at `http://localhost:6379`.

### Option 2: Run without Docker
Ensure the following are installed:
- **PostgreSQL** (version 16 or above recommended)
- **Node.js** (version 20 or above)

#### Steps
1. **Backend Setup**
    - If system does not have Redis installed. Then run 
      ```
      docker compose build redis
      docker compose run redis
      ```
      Note: Make sure redis is running.
    - Navigate to the `Backend` folder.
    - Can modify configuration from `configs/.env.development`
    - Install dependencies and set up the database:
      ```bash
      npm install
      npm run migrate:dev
      npm run dev
      ```
      This will configure the database and seed it with some dummy data. The backend server will be accessible at `http://localhost:3010`.

2. **Frontend Setup**
    - Navigate to the `Frontend` folder.
    - Can modify configuration from `configs/.env.development`
    - Install dependencies and start the development server:
      ```bash
      npm install
      npm run dev
      ```
      The frontend will be accessible at `http://localhost:3179`.

---

## Additional Information

### Default Credentials

```
  {
    email:'admin@test.test'
    password:'123456',
    role:'SUPER_ADMIN'
  },
  {
    email:'manager@test.test'
    password:'123456',
    role:'MANAGER'
  },
  {
    email:'user@test.test'
    password:'123456',
    role:'USER'
  }

```