const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User } = require('../models')
const { Session } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  } else {
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(req.token, SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findByPk(decodedToken.id)
  if (!user) {
    return res.status(401).json({ error: 'user not found' })
  }

  req.user = user
  next()
}

const sessionChecker = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Token missing' })
  }

  const session = await Session.findOne({ where: { token: req.token } })
  if (!session) {
    return res.status(401).json({ error: 'Session not found or expired' })
  }

  next()
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map((err) => err.message)
    return res.status(400).json({
      error: 'Validation error',
      details: messages,
    })
  }

  console.error('Unhandled error:', error)
  res.status(500).json({ error: 'Something went wrong' })
}

module.exports = { tokenExtractor, userExtractor, errorHandler, sessionChecker }
