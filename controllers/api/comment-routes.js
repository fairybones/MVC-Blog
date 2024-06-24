const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// fetching from '/api/comments

// GET all comments
router.get('/', (req, res) => {
    Comment.findAll()
    .then(dbComment => res.json(dbComment))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

// allow user to POST comment if logged in
router.post('/', withAuth, (req, res) => {
    // pass in withAuth helper function
    if (req.session) {
        // implement CRUD operation
        Comment.create({
            text: req.body.text,
            post_id: req.body.post_id,
            user_id: req.body.user_id
        })
        .then(dbComment => res.json(dbComment))
        .catch(err => {
            console.log(err);
            res.status(404).json(err);
        });
    }
});

// allow user to DELETE comment by id
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }) // if comment exists with id specified, update db
    .then(dbComment => {
        if (!dbComment) {
            res.status(404).json({ message: 'No comment found matching that id.' });
            return;
        }
        res.json(dbComment);
    })
    .catch(err => {
        console.log(err);
        res.status(404).json(err);
    });
});

module.exports = router;