import type { MDBApiResult, MDBMovie, MDBSearch } from '../types'
import config from 'config'
import axios from 'axios'
//@ts-ignore
import replaceSpecialCharacters from 'replace-special-characters'

const MDB_KEY = config.get<number>('mdbKey')

const mdbApi = axios.create({ baseURL: 'https://api.themoviedb.org/3' })

export const getFromMdb = async (title: string, year: number | string): Promise<MDBApiResult> => {
   try {
      const searchRes = (
         await mdbApi.get<MDBSearch>(
            `search/movie?api_key=${MDB_KEY}&query=${replaceSpecialCharacters(
               title
            )}&primary_release_year=${year}`
         )
      ).data

      if (searchRes.total_results === 0) {
         throw new Error()
      }

      searchRes.results.sort((a, b) => b.popularity - a.popularity)

      const movieRes = (
         await mdbApi.get<MDBMovie>(
            `movie/${searchRes.results[0].id}?api_key=${MDB_KEY}&append_to_response=videos`
         )
      ).data

      return {
         fallback: movieRes.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieRes.poster_path}`
            : 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
         backdrop: movieRes.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movieRes.backdrop_path}`
            : null,
         links: {
            imdb: movieRes.imdb_id ? `https://www.imdb.com/title/${movieRes.imdb_id}` : null,
            youtube:
               movieRes.videos.results[0].key && movieRes.videos.results.length > 0
                  ? `https://www.youtube.com/embed/${movieRes.videos.results[0].key}`
                  : null
         }
      }
   } catch {
      return {
         fallback: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
         backdrop: null,
         links: {
            imdb: null,
            youtube: null
         }
      }
   }
}
