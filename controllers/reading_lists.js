const express = require('express')
const { ReadingList } = require('../models')
const router = express.Router()

router.post('/', async (req, res) => {
  const { blog_id, user_id } = req.body

  if (!blog_id || !user_id) {
    return res.status(400).json({ error: 'blog_id and user_id are required' })
  }

  const readingListEntry = await ReadingList.create({ blog_id, user_id })
  res.status(201).json(readingListEntry)
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { read } = req.body

  if (typeof read !== 'boolean') {
    return res.status(400).json({ error: 'read must be a boolean' })
  }

  const readingListEntry = await ReadingList.findByPk(id)
  if (!readingListEntry) {
    return res.status(404).json({ error: 'Reading list entry not found' })
  }

  readingListEntry.read = read
  await readingListEntry.save()

  return res.status(200).json(readingListEntry)
})

module.exports = router
