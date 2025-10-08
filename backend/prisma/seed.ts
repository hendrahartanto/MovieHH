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
  const now = new Date();
  const end = new Date();
  end.setMonth(now.getMonth() + 1); // Film tayang 1 bulan ke depan

  const movie = await prisma.movie.create({
    data: {
      title: "Galactic Adventures",
      synopsis: "A sci-fi action film about space exploration.",
      posterUrl: "https://example.com/galactic.jpg",
      duration: 120,
      director: "Hendra Hartanto",
      writer: "Hendra Hartanto",
      releaseDate: now,
      endDate: end,
      isFeatured: true,
      status: "ACTIVE", // pakai enum MovieStatus
      genres: {
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
  });

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

  // 4. Seed theater (pakai service)
  const theater = await theaterService.createTheater({
    name: "Cinema XXI Mega Mall",
    locationId: location.id,
  });

  // 5. Seed showtime
  const now = new Date();
  const showTimeStart = "19:00";
  const showTimeEnd = "21:00";

  const movieSchedule = await showTimeService.createMovieSchedule({
    date: now,
    movieId: movie.id,
    price: 60000,
    theaterId: theater.id,
  });

  await showTimeService.createShowTime({
    movieScheduleId: movieSchedule.id,
    startTime: showTimeStart,
    endTime: showTimeEnd,
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
