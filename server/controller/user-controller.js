// // import UserModel from '../models/user-model.js'

// export const getMovie = async (req, res) => { 
//    const id = req.params.id
//    try {
//       const movie = await UserModel.findById(id)
//       res.status(200).json(movie)
//    } catch (err) {
//       res.status(404).json({ error: err.message })
//    }
// }

// export const getMovieValue = async (req, res) => { 
//    const id = req.params.id
//    const key = req.params.key
//    try {
//       const movie = await UserModel.findById(id)
//       movie[key] ? res.status(200).json(movie[key]) : res.status(404).json({ error: 'Value not found' })
//    } catch (err) {
//       res.status(404).json({ error: err.message })
//    }
// }

// export const createMovie = async (req, res) => {
//    const body = req.body
//    const newMovie = new UserModel(body)
//    try {
//       await newMovie.save()
//       res.status(201).json(newMovie)
//    } catch (err) {
//       res.status(409).json({ error: err.message })
//    }
// }

// export const getAllMovies = async (req, res) => {
//    try {
//       const user = await UserModel.find({})
//       res.status(200).json(user.movies)
//    } catch (err) {
//       res.status(404).json({ error: err.message })
//    }
// }
