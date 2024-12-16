const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor, userExtractor } = require('../util/middlewares')

router.delete('/', tokenExtractor, userExtractor, async (req, res) => {
  const session = await Session.findOne({ where: { user_id: req.user.id } })
  if (session) {
    await session.destroy()
  }
  res.status(204).end()
})

module.exports = router
