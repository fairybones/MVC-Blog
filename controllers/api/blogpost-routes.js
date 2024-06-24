const router = require('express').Router();
const { Post, Comment, User } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all blogposts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'body', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: [
                    'id', 'text', 'post_id', 'user_id', 'created_at'
                ],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    .then(dbPost => res.json(dbPost))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// find a specific blogpost by id
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'body', 'created_at'],
        include:[ 
        {
            model: User,
            attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }
    ]
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'No blog post found matching that id' });
            return;
        }
        res.json(dbPost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// CREATE new post if logged in
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        body: req.body.body,
        user_id: req.session.user_id
    })
    .then(dbPost => res.json(dbPost))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// UPDATE post (if logged in) by id
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            body: req.body.body
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPost => {
        if (!dbPost) {
            res.status(404).json({ message: 'No blog post found matching that id' });
            return;
        }
        res.json(dbPost);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;