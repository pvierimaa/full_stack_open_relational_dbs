const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      as: 'blogs',
      attributes: ['id', 'title', 'author', 'url', 'likes', 'year'],
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          model: ReadingList,
          attributes: ['read', 'id'],
          where: req.query.read ? { read: req.query.read === 'true' } : {},
        },
      },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  user.name = req.body.name || user.name
  const updatedUser = await user.save()
  res.json(updatedUser)
})

module.exports = router
