import PostMessage from '../models/postMessage.js'

export const getPost = async (req, res) => {
   try {
      const postMessages = await PostMessage.find()
      res.status(200).json(postMessages)
   } catch (err) {
      res.status(404).json({ message: err.message })
   }
}

export const createPost = async (req, res) => {
   const body = req.body
   const newMovie = new PostMessage(body)
   try {
      await newMovie.save()
      res.status(201).json(newMovie)
   } catch (err) {
      res.status(409).json({ message: err.message })
   }
}
