import { Types } from 'mongoose'
import { TypeOf } from 'zod'
import { createMovieSchema, getMoveSchema, updateMovieSchema } from './resources/movie.schema'


export interface MovieSource {
   id:        number;
   title:     string;
   year:      string;
   runtime:   string;
   genres:    string[];
   director:  string;
   actors:    string;
   plot:      string;
   posterUrl: string;
}

export interface MovieType {
   title: string
   year: number
   genres: Types.Array<string>
   director: string
   actors: Types.Array<string>
   plot: string
   runtime: number
   poster: {
      image: string
      fallback?: string
   }
}

export interface MovieDoc extends MovieType {
   _id: string
}

export type CreateMovieInput = TypeOf<typeof createMovieSchema>
export type GetAndDeleteMovieInput = TypeOf<typeof getMovieSchema>
export type UpdateMovieInput = TypeOf<typeof updateMovieSchema>

export interface MDBSearch {
   page: number
   results: MDBSearchResult[]
   total_pages: number
   total_results: number
}

export interface MDBSearchResult {
   adult: boolean
   backdrop_path: null | string
   genre_ids: number[]
   id: number
   original_language: string
   original_title: string
   overview: string
   popularity: number
   poster_path: null | string
   release_date: string
   title: string
   video: boolean
   vote_average: number
   vote_count: number
}

export interface MDBMovie {
   adult:                 boolean;
   backdrop_path:         string;
   belongs_to_collection: null;
   budget:                number;
   genres:                Genre[];
   homepage:              string;
   id:                    number;
   imdb_id:               string;
   original_language:     string;
   original_title:        string;
   overview:              string;
   popularity:            number;
   poster_path:           string;
   production_companies:  ProductionCompany[];
   production_countries:  ProductionCountry[];
   release_date:          Date;
   revenue:               number;
   runtime:               number;
   spoken_languages:      SpokenLanguage[];
   status:                string;
   tagline:               string;
   title:                 string;
   video:                 boolean;
   vote_average:          number;
   vote_count:            number;
   videos:                Videos;
}

export interface Genre {
   id:   number;
   name: string;
}

export interface ProductionCompany {
   id:             number;
   logo_path:      null | string;
   name:           string;
   origin_country: string;
}

export interface ProductionCountry {
   iso_3166_1: string;
   name:       string;
}

export interface SpokenLanguage {
   english_name: string;
   iso_639_1:    string;
   name:         string;
}

export interface Videos {
   results: Result[];
}

export interface Result {
   iso_639_1:    string;
   iso_3166_1:   string;
   name:         string;
   key:          string;
   site:         string;
   size:         number;
   type:         string;
   official:     boolean;
   published_at: Date;
   id:           string;
}
