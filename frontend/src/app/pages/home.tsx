import { ActiveMoviesCarousel } from "@/features/movies/components/active-movies-carousel";
import { FeaturedMoviesCarousel } from "@/features/movies/components/featured-movies-carousel";
import { UpcomingMoviesCarousel } from "@/features/movies/components/upcoming-movies-carousel";

const HomePage = () => {
  return (
    <div>
      <FeaturedMoviesCarousel />
      <div className="content-wrapper space-y-4 py-8">
        <ActiveMoviesCarousel />
        <UpcomingMoviesCarousel />
      </div>
    </div>
  );
};

export default HomePage;
