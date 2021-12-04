import axios from "axios";

const url: string = 'http://localhost:4000/movies'

export const fetchPosts = () => axios.get(url)