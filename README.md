
# Loyalty Wallet App

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>



### Description

The purpose of this project is to learn NestJS through hands-on projects, named Loyalty Wallet App. A complete explanation of the code is provided below.

### Requirements

```bash
Docker/ Docker-compose
```

### Installation

1. Run docker cmd

    ```bash
    docker-compose up
    ```

2. Once the server is running go to Follwing URL to set up DB

    ```bash
    http://localhost:5050/
    ```

3. Login With following cred

    ```bash
    admin@admin.com
    pgadmin4
    ```

4. Right-click on `Servers` and select `Register` -> `Server`.
5. Give Name of your Choice.
6. Go to `connection` tab. Fill the exact information
    - Host name/address: db
    - Port: 5432
    - Maintenance database: postgres
    - Username: postgres
    - Password: Hacker@55

7. Go to CodeBase go to `main.module.ts` file. uncomment the following lines.

    ```typescript
    TypeOrmModule.forRoot({ // Configuring TypeORM for database connection
          type: 'postgres', // Database type (PostgreSQL)
          host: 'db', // Database host
          port: 5432, // Database port
          username: 'postgres', // Database username
          password: 'Hacker@55', // Database password
          database: 'postgres', // Database name
          entities: [User,Transaction,Point_table], // Database entities (e.g., User entity)
          synchronize: true, // Auto-sync database schema (caution in production)
          autoLoadEntities: true, // Auto-load entities from the given directories
        }),
        TypeOrmModule.forFeature([User, Transaction, Point_table]),
    ```

8. Restart Docker-compose using

    ```bash
    docker-compose up
    ```

### Detail Description

The are three tables used in this project. 
- user
- transactions
- points

1. user tables
- All authentication information is stored in this tables.
- authentication is done using JWT tokens

2. transactions Table
- All transaction are recorded in this tables.
- user can retrive Earn and Burn points information from this table.

3. Points Table
- This Table record the Currents and Total points of user.
- this also has Earn and Burn API.

### APIs

1. Register User ` http://localhost:3000/auth/register `

This is Post request Where we have to send user Information in body

    ```json
    {
      "username": "Abhishek Zade",
      "password": "Hacker@55",
      "email": "zadeabhi8781@gmail.com"
    }
    ```

2. Login User ` http://0.0.0.0:3000/auth/login ` 
This is post request where we habe send user cred as body.

    ```json
    {"email":"zadeabhi8781@gmail.com", "password":"Hacker@55"}
    ```

in responce we will get Bear token which will be required for futher Operations
for example

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJFbWFpbCI6InphZGVhYmhpODc4MUBnbWFpbC5jb20iLCJpYXQiOjE3MDQ4OTI3NzIsImV4cCI6MTcwNDg5MzA3Mn0.gMrcgCZrPfiEVyLcPnc5........................
    ```

3. Get User Profile ` http://localhost:3000/users/profile `
This is Get request where users information comes in response.
Auth-type: Bearer token
Token : Copy the responce token form login API.

4. get Total Score ` http://localhost:3000/points/totalpoints `
this is Get request where users Total points comes in Responce.
Auth-type: Bearer token
Token : Copy the responce token form login API.

5. Get Current Valid Score ` http://localhost:3000/points/validpoints `
this is the Get request where users Current valid points recived as responce.
Auth-type: Bearer token
Token : Copy the responce token form login API.

6. Earn point ` http://localhost:3000/points/earnPoints `
This is put request where we have to send points in body.

    ```json
    {
      "points": 1500
    }
    ```

Auth-type: Bearer token
Token : Copy the responce token form login API.

7. Burn point ` http://localhost:3000/points/burnPoints `
This is put request where we have to send points in body.

    ```bash
    {
      "points": 500
    }

    ```

Auth-type: Bearer token
Token : Copy the responce token form login API.

8. Get Transactions ` http://localhost:3000/transactions `
This API request gives all Transaction of Current User,
Auth-type: Bearer token
Token : Copy the responce token form login API.