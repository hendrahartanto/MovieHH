import { CinemaList } from "@/features/theaters/components/cinema-list";

const CinemaListPage = () => {
  return (
    <div className="content-wrapper py-24">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Cinemas
        </h2>
        <p className="text-muted-foreground">
          Find your favorite cinema and enjoy the ultimate movie experience.
        </p>
      </div>
      <CinemaList />
    </div>
  );
};

export default CinemaListPage;
