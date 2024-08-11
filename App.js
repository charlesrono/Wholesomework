// src/App.js

import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleAddUser = () => {
    axios.post('http://localhost:5000/api/users', { name, email }).then((response) => {
      setUsers([...users, response.data]);
      setName('');
      setEmail('');
    });
  };

  const handleUpdateScore = (id, newScore) => {
    axios.put(`http://localhost:5000/api/users/${id}`, { wellnessScore: newScore }).then((response) => {
      setUsers(users.map((user) => (user._id === id ? response.data : user)));
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee Wellness Platform
      </Typography>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddUser}>
        Add User
      </Button>
      <List>
        {users.map((user) => (
          <ListItem key={user._id}>
            <ListItemText
              primary={`${user.name} (${user.email})`}
              secondary={`Wellness Score: ${user.wellnessScore}`}
            />
            <Button onClick={() => handleUpdateScore(user._id, user.wellnessScore + 1)}>
              Increase Score
            </Button>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App;

