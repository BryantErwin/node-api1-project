// implement your API here
const express = require('express');
const server = express();
const db = require('./data/db.js');
server.use(express.json());

server.get('/', (req, res) => {
    res.send('No Errors');
});

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            res.status(550).json({error: "That user was not found."});
        });
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
          if(!user){
              res.status(404).json({error: "That user ID doesn't exist on this server."});
          } else{
              res.json(user);
          }
        })
    .catch(err => {
        res.status(400).json({error: "The users description is not available."})
    });
});

server.post('/api/users', (req, res) => {
    const userDesc = req.body;
    if (!userDesc.name || !userDesc.bio) {
        res.status(400).json({error: "Enter a name and bio for this user."})
    } else{
        db.insert(userDesc)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                res.json({error: "The user was not added!"});
            });
    }
});

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({error: "That user ID doesn't exist on this server."});
            }else {
                db.remove(id)
                    .then(hub => {
                    res.status(201).json(hub);
                })
                    .catch(err => {
                        res.status(500).json({error: "There was an error deleting the user."});
                    });
            }
        })
});
server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const modify = req.body;
    db.findById(id).then(user => {
        if (!user) {
            res.status(404).json({ message: "That user ID doesn't exist on this server."});
        } else if (!modify.name || !modify.bio) {
            res.status(400).json({ error: "Please enter a user name and bio."});
        } else {
            db.update(id, modify)
                .then(hub => {
                    res.status(200).json(hub);
                })
                .catch(err => {
                    res.status(500).json({ message: "That user was not modified!"});
                });
        }
    });
});


const port = 8000;
server.listen(port, () => console.log('API on port 8000'))
