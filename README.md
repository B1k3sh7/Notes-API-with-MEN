Documentation: http://localhost:5000/api-docs/

Env File Structure:

MONGO_URI = "Your MongoDB URI Here"
PORT = 5000
SECRET_KEY = "Your Secret Key Here"

Docker-compose:

Set Variables on Line 20 and 21
SECRET_KEY = "Your Secret Key Here"
MONGO_URI = "Your MongoDB URI Here"

NPM Command: node index.js

Docker Commands: Docker compose up --scale api=Number of instances
