import { PrismaClient } from "@prisma/client";
import theaterService from "../src/apps/theater/domain/theater.service";
import showTimeService from "../src/apps/show-time/domain/show-time.service";

const prisma = new PrismaClient();

async function seedGenres() {
  const genreNames = ["Action", "Comedy", "Drama", "Sci-Fi"];
  const genres = [];

  for (const name of genreNames) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    genres.push(genre);
  }

  return genres;
}

async function seedMovieWithGenres(genreIds: string[]) {
  const movie = await prisma.movie.create({
    data: {
      title: "Galactic Adventures",
      description: "A sci-fi action film about space exploration.",
      posterUrl: "https://example.com/galactic.jpg",
      duration: 120,
      director: "Hendra Hartanto",
      writer: "Hendra Hartanto",
    },
  });

  const relations = genreIds.map((genreId) => ({
    genreId,
    movieId: movie.id,
  }));

  await prisma.genresOnMovies.createMany({ data: relations });

  return movie;
}

async function main() {
  console.log("🚀 Starting seed...");

  // 1. Seed genres
  const genres = await seedGenres();

  // 2. Seed movie + genre linkage
  const movie = await seedMovieWithGenres([genres[0].id, genres[3].id]); // Action + Sci-Fi

  // 3. Seed location
  const location = await prisma.location.upsert({
    where: { name: "Mega Mall" },
    update: {},
    create: {
      name: "Mega Mall",
      address: "Jl. Mega Kuningan, Jakarta Selatan",
    },
  });

  // 4. Seed theater (using service, includes seats)
  const theater = await theaterService.createTheater({
    name: "Cinema XXI Mega Mall",
    locationId: location.id,
  });

  // 5. Seed showtime (using service, includes SeatsOnShowTimes)
  const now = new Date();
  const showTimeStart = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
  const showTimeEnd = new Date(showTimeStart.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  await showTimeService.createShowTime({
    movieId: movie.id,
    theaterId: theater.id,
    startTime: showTimeStart,
    endTime: showTimeEnd,
    price: 60000,
  });

  console.log("✅ Seeding complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
