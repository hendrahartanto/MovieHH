import movieRepository from "../data-access/movie.repository";
import { CreateMovieDTO } from "./dto/create-movie.dto";

const createMovie = async (createMovieData: CreateMovieDTO) => {
  //TODO: create genre validation maybe
  return movieRepository.createMovie(createMovieData);
};

export default {
  createMovie,
};
