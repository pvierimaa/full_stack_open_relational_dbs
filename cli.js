require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

// Yhteys PostgreSQL-tietokantaan
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false, // Estää debug-viestit
})

const main = async () => {
  try {
    // Yhdistä tietokantaan
    await sequelize.authenticate()
    console.log('Connected to the database')

    // Hae blogit tietokannasta
    const blogs = await sequelize.query('SELECT author, title, likes FROM blogs', {
      type: QueryTypes.SELECT,
    })

    console.log('Blogs in database:')
    // Tulosta blogit
    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  } finally {
    // Sulje yhteys tietokantaan
    await sequelize.close()
  }
}

main()
