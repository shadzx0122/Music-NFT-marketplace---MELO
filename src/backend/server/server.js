// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// In-memory database for simplicity 
const users = [
  { id : 1 , username: 'shreyas', email: 'shreyas22@gmail.com', password: 'shreyas123' ,  }
  
];

const highestId = users.reduce((maxId, user) => {
  return user.id > maxId ? user.id : maxId;
}, 0);


function getid(){
    let id = highestId + 1;
    return id ;
}

// Register endpoint
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email is already registered
  const existingUser = users.find(user => user.email === email);
  const existingName = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(201).json({ success: false, message: 'Email already exists' });
  }
  if (existingName) {
  return res.status(201).json({success : false, message: 'Username already exists'});
  }
  const id = getid();
  // Add the new user to the users array
  users.push({id, username, email, password });

  res.status(201).json({ success: true, message: 'User registered successfully' });
});

// Login endpoint (existing endpoint)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user with the provided email
  const user = users.find(u => u.email === email) ?? null;

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Check if the provided password matches the user's password
  if (user.password !== password) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  // Authentication successful
  res.status(200).json({ success: true, message: 'Login successful', name : user.username , id : user.id});
}
);
app.get('/', (req,res) => {
        res.send(users);
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
