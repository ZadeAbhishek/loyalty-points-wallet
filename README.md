# Loyalty Wallet App

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

The Loyalty Wallet App is a NestJS project created for hands-on learning. This README provides comprehensive instructions and details about the project.

## Requirements

- Docker
- Docker-compose

## Installation

1. Run Docker CMD

    ```bash
    docker-compose up
    ```

2. Once the server is running, set up the database by visiting:

    ```bash
    http://localhost:5050/
    ```

3. Login with the following credentials:

    ```bash
    admin@admin.com
    pgadmin4
    ```

4. Right-click on `Servers` and select `Register` -> `Server`.
5. Fill in the required information under the `connection` tab:

    - Host name/address: db
    - Port: 5432
    - Maintenance database: postgres
    - Username: postgres
    - Password: Hacker@55

6. Uncomment the following lines in `main.module.ts`:

    ```typescript
    // TypeOrmModule configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'postgres',
      password: 'Hacker@55',
      database: 'postgres',
      entities: [User, Transaction, Point_table],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Transaction, Point_table]),
    ```

7. Restart Docker-compose using:

    ```bash
    docker-compose up
    ```

## Detail Description

Three tables are used in this project:

1. **User Table**
   - Stores authentication information.
   - JWT tokens are used for authentication.

2. **Transactions Table**
   - Records all transactions.
   - Users can retrieve Earn and Burn points information.

3. **Points Table**
   - Records Current and Total points of users.
   - Supports Earn and Burn APIs.

## Relationships between the three tables: `User`, `Transaction`, and `Point_table`.

### Database Relationships

1. **User to Transaction Relationship:**
   - **Type:** One-to-Many
   - **Explanation:** One user can have multiple transactions recorded in the `Transaction` table. This relationship is established through the `transactions` attribute in the `User` entity, which is defined as a One-to-Many relation.

2. **User to Point_table Relationship:**
   - **Type:** One-to-One
   - **Explanation:** Each user has a corresponding entry in the `Point_table` table, storing information about their current and total points. The relationship is established through the `point_table` attribute in the `User` entity, which is defined as a One-to-One relation.

3. **Transaction to User Relationship:**
   - **Type:** Many-to-One
   - **Explanation:** Each transaction is associated with a specific user, recorded in the `User` table. This relationship is established through the `user` attribute in the `Transaction` entity, which is defined as a Many-to-One relation.

4. **Point_table to User Relationship:**
   - **Type:** One-to-One
   - **Explanation:** Each entry in the `Point_table` table is associated with a specific user. This relationship is established through the `user` attribute in the `Point_table` entity, which is defined as a One-to-One relation.

### Summary:

- Users can have multiple transactions, creating a One-to-Many relationship between `User` and `Transaction`.
- Each user has a unique entry in the `Point_table` table, establishing a One-to-One relationship between `User` and `Point_table`.
- Each transaction is associated with a specific user, resulting in a Many-to-One relationship between `Transaction` and `User`.
- Each entry in the `Point_table` table corresponds to a single user, forming a One-to-One relationship between `Point_table` and `User`.

These relationships help organize and connect data between the `User`, `Transaction`, and `Point_table` tables in a meaningful way within your Loyalty Wallet App.

## APIs

1. **Register User**
   - Endpoint: `http://localhost:3000/auth/register`
   - Method: POST
   - Request Body:
     ```json
     {
       "username": "Abhishek Zade",
       "password": "Hacker@55",
       "email": "zadeabhi8781@gmail.com"
     }
     ```
   - Response: ...

2. **Login User**
   - Endpoint: `http://0.0.0.0:3000/auth/login`
   - Method: POST
   - Request Body:
     ```json
     {"email":"zadeabhi8781@gmail.com", "password":"Hacker@55"}
     ```
   - Response: ...

3. **Get User Profile**
   - Endpoint: `http://localhost:3000/users/profile`
   - Method: GET
   - Auth-type: Bearer token
   - Token: Copy the token from the login API response.

4. **Get Total Score**
   - Endpoint: `http://localhost:3000/points/totalpoints`
   - Method: GET
   - Auth-type: Bearer token
   - Token: Copy the token from the login API response.

5. **Get Current Valid Score**
   - Endpoint: `http://localhost:3000/points/validpoints`
   - Method: GET
   - Auth-type: Bearer token
   - Token: Copy the token from the login API response.

6. **Earn Points**
   - Endpoint: `http://localhost:3000/points/earnPoints`
   - Method: PUT
   - Request Body:
     ```json
     {
       "points": 1500
     }
     ```
   - Auth-type: Bearer token
   - Token: Copy the token from the login API response.

7. **Burn Points**
   - Endpoint: `http://localhost:3000/points/burnPoints`
   - Method: PUT
   - Request Body:
     ```json
     {
       "Points": 543,
       "ReceiverEmail": "rahul@gmail.com"
     }
     ```
   - Auth-type: Bearer token
   - Token: Copy the token from the login API response.

8. **Get Transactions**
   - Endpoint: `http://localhost:3000/transactions`
   - Method: GET
   - Auth-type: Bearer token
   - Token: Copy the token from the login API response.
   - Query Parameters:
     - startTime
     - endTime
     - type
     - senderEmail

     **Examples:**
     1. Full Transactions List:
     ```json
     {
       "startTime": "",
       "endTime": "",
       "type": "",
       "senderEmail": ""
     }
     ```

     2. Filtered Transactions:
     ```json
     {
       "startTime": "2024-01-29T08:16:53.835Z",
       "endTime": "2024-01-29T08:18:33.033Z",
       "type": "credit",
       "senderEmail": "hacker@gmail.com"
     }
     ```

     3. Missing `startTime`:
     ```json
     {
       "startTime": "",
       "endTime": "2024-01-29T08:18:33.033Z",
       "type": "credit",
       "senderEmail": "hacker@gmail.com"
     }
     ```

     4. Missing `endTime`:
     ```json
     {
       "startTime": "2024-01-29T08:16:53.835Z",
       "type": "credit",
       "senderEmail": "hacker@gmail.com"
     }
     ```

     5. Missing `type`:
     ```json
     {
       "startTime": "2024-01-29T08:16:53.835Z",
       "endTime": "2024-01-29T08:18:33.033Z",
       "senderEmail": "hacker@gmail.com"
     }
     ```

     6. Missing `senderEmail`:
     ```json
     {
       "startTime": "2024-01-29T08:16:53.835Z",
       "endTime": "2024-01-29T08:18:33.033Z",
       "type": "credit"
     }
     ```

     7. Missing `startTime` and `endTime`:
     ```json
     {
       "type": "credit",
       "senderEmail": "hacker@gmail.com"
     }
     ```