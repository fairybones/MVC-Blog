const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// fetching from '/api/users'

// GET all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUser => res.json(dbUser))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET a user by id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [{
            model: Post,
            attributes: ['id', 'title', 'body', 'created_at']
        },
        {
            model: Comment,
            attributes: ['id', 'text', 'created_at']
        }
        ]
    })
    .then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ message: 'No user found matching that id'});
            return;
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// CREATE a new user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUser => {
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;
            // add user to db
            res.json(dbUser)
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// UPDATE user by id
router.put(':/id', (req, res) => {
    User.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbUser => {
        // check if id exists
        if (!dbUser[0]) {
            res.status(404).json({ message: 'No user found matching that id'});
            return;
        }
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// verify user then login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(dbUser => {
        if(!dbUser) {
            res.status(400).json({ message: 'This username does not exist, try again' });
            return;
        }
        const valid = dbUser.checkPassword(req.body.password);
        if (!valid) {
            res.status(400).json({ message: 'The password you entered is incorrect, please try again' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;
            res.json({ user: dbUser, message: 'You are successfully logged in!'})
        });
    });
});

// allow users to logout
router.post('/logout', (req, res) => {
    // check to make sure user is logged in
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(200).end();
        })
     } else {
            res.status(400).end();
        }
});

// DELETE user by id 
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ message: 'No user found matching that id' });
            return;
        }
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;