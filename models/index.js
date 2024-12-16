const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./reading_list')
const Session = require('./session')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList })

Session.belongsTo(User)
User.hasMany(Session)

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
}
