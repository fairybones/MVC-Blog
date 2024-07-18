const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// GET all blog posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'title',
            'body',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
.then(dbPost => {
    const posts = dbPost.map(post => post.get({ plain: true }));
    res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
    });
})
.catch(err => {
    console.log('Oops! An error occurred:', err);
    res.status(500).json(err);
})
})

// login - else redirect
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

// route to signup form
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// GET all blogposts by id
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 'title', 'body', 'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id', 'text', 'user_id', 'post_id', 'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => {
        if (!dbPost) {
            res.status(404).json({ message: 'No blogpost found matching that id.'});
            return;
        }
        // make sure data is serialized so accessible
        const post = dbPost.get({ plain: true });
        // pass in post data to template for rendering
        res.render('this-blogpost', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log('Something went wrong: ', err);
        res.status(500).json(err);
    });
});

module.exports = router;