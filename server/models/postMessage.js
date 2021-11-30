import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
   id: Number,
   title: String,
   year: String,
   runtime: String,
   genres: [String],
   director: String,
   actors: String,
   plot: String,
   posterUrl: String
})

const PostMessage = mongoose.model('PostMessage', postSchema)

export default PostMessage