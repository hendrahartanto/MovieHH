import { ActiveMoviesCarousel } from "@/features/movies/components/active-movies-carousel";
import { FeaturedMoviesCarousel } from "@/features/movies/components/featured-movies-carousel";

const HomePage = () => {
  return (
    <div>
      <FeaturedMoviesCarousel />
      <ActiveMoviesCarousel />
    </div>
  )
};

export default HomePage;
