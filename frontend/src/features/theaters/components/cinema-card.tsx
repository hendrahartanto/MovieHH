import { paths } from "@/config/paths";
import { Theater } from "../types";
import { Armchair, Film, MapPin } from "lucide-react";
import { Link } from "react-router";

interface CinemaCardProps {
  theater: Theater;
}

export const CinemaCard = ({ theater }: CinemaCardProps) => {
  return (
    <Link to={paths.cinema.getHref(theater.id)}>
      <div className="group relative bg-card text-card-foreground rounded-xl p-6 cinema-border hover:cinema-glow transition-all duration-300 flex flex-col justify-between hover:cursor-pointer">
        <div>
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-1">
            {theater.name}
          </h3>

          <div className="flex items-start text-muted-foreground mb-4">
            <MapPin className="w-5 h-5 mr-2 shrink-0 text-primary" />
            <span className="text-sm line-clamp-2">
              {(theater.location as any)?.address ||
                (theater.location as any)?.city ||
                "Address not available"}
            </span>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-border flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Armchair className="w-4 h-4 mr-1.5 text-primary" />
            <span>
              <strong className="text-foreground">
                {theater.seats?.length || 0}
              </strong>{" "}
              Seats
            </span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Film className="w-4 h-4 mr-1.5 text-primary" />
            <span>
              <strong className="text-foreground">
                {theater.movieSchedules?.length || 0}
              </strong>{" "}
              Showing
            </span>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:bg-primary/10 transition-colors" />
      </div>
    </Link>
  );
};
