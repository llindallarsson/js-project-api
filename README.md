# Happy Thoughts API

A RESTful API for sharing and managing happy thoughts with user authentication.

## API Endpoints

### Root

`GET /`
Welcome message for the API.

### Thoughts

`GET /thoughts`
Retrieves all thoughts.

`POST /thoughts`
Creates a new thought.

`GET /thoughts/:id`
Retrieves a specific thought by ID.

`PUT /thoughts/:id`
Updates a specific thought.

`DELETE /thoughts/:id`
Deletes a specific thought.

`POST /thoughts/:id/like`
Adds a like (heart) to a specific thought.

### Users

`POST /users`
Registers a new user.

`POST /users/sessions`
Logs in an existing user.
