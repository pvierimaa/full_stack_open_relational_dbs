const router = require('express').Router()
const { Blog } = require('../models')
const sequelize = require('sequelize')

router.get('/', async (req, res) => {
  const query = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: ['author'],
    order: [['likes', 'DESC']],
  })
  res.json(query)
})

module.exports = router
