const router = require('express').Router()
const { tokenExtractor, userExtractor, sessionChecker } = require('../util/middlewares')
const { Blog, User } = require('../models')
const { Op } = require('sequelize')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'user',
    },
  })
  next()
}

router.get('/', async (req, res) => {
  const { search } = req.query
  const where = {}

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ]
  }

  const blogs = await Blog.findAll({
    where,
    order: [['likes', 'DESC']],
    include: {
      model: User,
      as: 'user',
    },
  })

  res.json(blogs)
})

router.post('/', tokenExtractor, userExtractor, sessionChecker, async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    userId: req.user.id,
  })
  res.json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete(
  '/:id',
  tokenExtractor,
  userExtractor,
  sessionChecker,
  blogFinder,
  async (req, res) => {
    if (req.blog.userId !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to delete this blog' })
    }

    await req.blog.destroy()
    res.status(204).end()
  }
)

router.put('/:id', blogFinder, async (req, res) => {
  if (!req.blog) {
    return res.sendStatus(404)
  }

  const { likes } = req.body
  if (typeof likes !== 'number' || likes < 0) {
    return res.sendStatus(400)
  }

  req.blog.likes = likes
  await req.blog.save()
  res.json(req.blog)
})

module.exports = router
