import movieRepository from "../data-access/movie.repository";
import { CreateMovieDTO } from "./dto/create-movie.dto";

const create = async (createMovieData: CreateMovieDTO) => {
  //TODO: create genre validation maybe
  return movieRepository.createMovie(createMovieData);
};
