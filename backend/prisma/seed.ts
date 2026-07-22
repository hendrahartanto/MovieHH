import { PrismaClient } from "@prisma/client";
import theaterService from "../src/apps/theater/domain/theater.service";
import showTimeService from "../src/apps/show-time/domain/show-time.service";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

function copySeedImages() {
  const srcDir = path.join(__dirname, "../src/assets/seed-images");
  const destDir = path.join(__dirname, "../uploads");

  console.log("Copying static seed images...");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const filesToCopy = [
    "avengers end game banner.jpg",
    "avengers end game poster.jpg",
    "interstellar banner.jpeg",
    "interstellar poster.jpg",
    "lalaland-banner.jpg",
    "lalaland-poster.jpg",
  ];

  for (const filename of filesToCopy) {
    const srcPath = path.join(srcDir, filename);
    const destPath = path.join(destDir, filename);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${filename} to uploads/`);
    } else {
      console.warn(`Warning: Source seed image not found: ${srcPath}`);
    }
  }
}

async function main() {
  console.log("Starting seeding...");

  copySeedImages();

  console.log("Cleaning up database...");
  await prisma.payment.deleteMany();
  await prisma.reservationDetail.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.seatsOnShowTimes.deleteMany();
  await prisma.showTime.deleteMany();
  await prisma.movieSchedule.deleteMany();
  await prisma.genresOnMovies.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.theater.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();
  console.log("Database clean!");

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("123123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  const demoUsers = [];
  const userData = [
    { email: "user1@gmail.com", name: "John Doe" },
    { email: "user2@gmail.com", name: "Jane Smith" },
    { email: "user3@gmail.com", name: "Bob Johnson" },
  ];

  for (const u of userData) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        role: "USER",
        password: hashedPassword,
      },
    });
    demoUsers.push(user);
  }

  console.log("Seeding genres...");
  const genreNames = [
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Horror",
    "Romance",
    "Thriller",
  ];
  const genreMap: Record<string, string> = {};
  for (const name of genreNames) {
    const genre = await prisma.genre.create({ data: { name } });
    genreMap[name] = genre.id;
  }

  console.log("Seeding movies...");
  const moviesData = [
    {
      title: "Avengers: Endgame",
      synopsis:
        "The Avengers assemble once more to reverse the destruction caused by Thanos.",
      posterUrl: "/uploads/avengers end game poster.jpg",
      bannerUrl: "/uploads/avengers end game banner.jpg",
      duration: 181,
      director: "Anthony Russo, Joe Russo",
      writer: "Christopher Markus, Stephen McFeely",
      isFeatured: true,
      status: "ACTIVE",
      genres: ["Action", "Sci-Fi", "Drama"],
      trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    },
    {
      title: "Interstellar",
      synopsis:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      posterUrl: "/uploads/interstellar poster.jpg",
      bannerUrl: "/uploads/interstellar banner.jpeg",
      duration: 169,
      director: "Christopher Nolan",
      writer: "Jonathan Nolan, Christopher Nolan",
      isFeatured: true,
      status: "ACTIVE",
      genres: ["Sci-Fi", "Drama", "Thriller"],
      trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    },
    {
      title: "La La Land",
      synopsis:
        "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
      posterUrl: "/uploads/lalaland-poster.jpg",
      bannerUrl: "/uploads/lalaland-banner.jpg",
      duration: 128,
      director: "Damien Chazelle",
      writer: "Damien Chazelle",
      isFeatured: false,
      status: "ACTIVE",
      genres: ["Romance", "Drama"],
      trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8",
    },
  ];

  const movies = [];
  for (const m of moviesData) {
    const movie = await prisma.movie.create({
      data: {
        title: m.title,
        synopsis: m.synopsis,
        posterUrl: m.posterUrl,
        bannerUrl: m.bannerUrl,
        duration: m.duration,
        director: m.director,
        writer: m.writer,
        isFeatured: m.isFeatured,
        status: m.status as any,
        trailerUrl: m.trailerUrl,
        genres: {
          create: m.genres.map((g) => ({
            genre: { connect: { id: genreMap[g] } },
          })),
        },
      },
    });
    movies.push(movie);
  }

  console.log("Seeding locations & theaters...");
  const locationsData = [
    {
      name: "Pacific Place Mall",
      address: "Jl. Jend. Sudirman No.52-53, SCBD, Jakarta Selatan",
      theaters: ["CGV Pacific Place", "Cinépolis Pacific Place"],
    },
    {
      name: "Gandaria City Mall",
      address: "Jl. Sultan Iskandar Muda, Kebayoran Lama, Jakarta Selatan",
      theaters: ["XXI Gandaria City"],
    },
  ];

  const dummyLayout: (0 | 1)[][] = [
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  ];

  const theaters = [];
  for (const loc of locationsData) {
    const location = await prisma.location.create({
      data: {
        name: loc.name,
        address: loc.address,
      },
    });

    for (const t of loc.theaters) {
      const theater = await theaterService.createTheater({
        name: t,
        locationId: location.id,
        layout: dummyLayout,
      });
      theaters.push(theater);
    }
  }

  console.log("Seeding dynamic schedules and showtimes...");
  const now = new Date();

  const theaterSeatsMap: Record<string, any[]> = {};
  for (const t of theaters) {
    const seats = await prisma.seat.findMany({
      where: { theaterId: t.id, deletedAt: null },
      orderBy: [{ seatRow: "asc" }, { seatNumber: "asc" }],
    });
    theaterSeatsMap[t.id] = seats;
  }

  const slots = [
    { start: "10:00", end: "13:00" },
    { start: "13:30", end: "16:30" },
    { start: "17:00", end: "20:00" },
    { start: "20:30", end: "23:30" },
  ];

  const createdShowTimes: any[] = [];

  for (let offset = -30; offset <= 7; offset++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + offset);
    const utcYear = targetDate.getUTCFullYear();
    const utcMonth = String(targetDate.getUTCMonth() + 1).padStart(2, "0");
    const utcDay = String(targetDate.getUTCDate()).padStart(2, "0");
    const targetDateUTC = new Date(`${utcYear}-${utcMonth}-${utcDay}T00:00:00.000Z`);

    for (const theater of theaters) {
      for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
        const movieIndex =
          Math.abs(offset + slotIndex + theaters.indexOf(theater)) %
          movies.length;
        const movie = movies[movieIndex];
        const slot = slots[slotIndex];

        const movieSchedule = await prisma.movieSchedule.create({
          data: {
            date: targetDateUTC,
            movieId: movie.id,
            theaterId: theater.id,
            price: 60000,
          },
        });

        const showTime = await showTimeService.createShowTime({
          movieScheduleId: movieSchedule.id,
          startTime: slot.start,
          endTime: slot.end,
        });

        createdShowTimes.push({
          id: showTime.id,
          startTime: showTime.startTime,
          endTime: showTime.endTime,
          theaterId: theater.id,
          price: 60000,
        });
      }
    }
  }

  console.log(`Created ${createdShowTimes.length} showtimes!`);

  console.log("Seeding reservations...");
  let reservationsCount = 0;

  for (const showTime of createdShowTimes) {
    const isPast = showTime.startTime < now;

    if (isPast) {
      const hasReservation = Math.random() < 0.6;
      if (!hasReservation) continue;

      const numReservations = Math.floor(Math.random() * 3) + 1;

      const bookedSeatIds = new Set<string>();
      const seats = theaterSeatsMap[showTime.theaterId];

      for (let r = 0; r < numReservations; r++) {
        const user = demoUsers[Math.floor(Math.random() * demoUsers.length)];

        const numSeats = Math.floor(Math.random() * 3) + 1;
        const selectedSeats = [];

        for (const seat of seats) {
          if (!bookedSeatIds.has(seat.id)) {
            selectedSeats.push(seat);
            bookedSeatIds.add(seat.id);
            if (selectedSeats.length === numSeats) break;
          }
        }

        if (selectedSeats.length === 0) continue;

        const rand = Math.random();
        let reservationStatus: "CONFIRMED" | "CANCELLED" | "EXPIRED" =
          "CONFIRMED";
        let paymentStatus: "PAID" | "CANCELLED" | "EXPIRED" = "PAID";

        if (rand < 0.1) {
          reservationStatus = "CANCELLED";
          paymentStatus = "CANCELLED";
        } else if (rand < 0.2) {
          reservationStatus = "EXPIRED";
          paymentStatus = "EXPIRED";
        }

        const totalPrice = selectedSeats.length * showTime.price;
        const createAt = new Date(showTime.startTime);
        createAt.setMinutes(
          createAt.getMinutes() - (Math.floor(Math.random() * 60) + 30),
        );

        const expiresAt = new Date(createAt);
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        let checkedInAt: Date | null = null;
        if (reservationStatus === "CONFIRMED" && Math.random() < 0.75) {
          checkedInAt = new Date(showTime.startTime);
          checkedInAt.setMinutes(
            checkedInAt.getMinutes() - (Math.floor(Math.random() * 10) + 5),
          );
        }

        const reservation = await prisma.reservation.create({
          data: {
            userId: user.id,
            showTimeId: showTime.id,
            status: reservationStatus,
            totalPrice,
            expiresAt,
            checkedInAt,
            createAt,
            reservationDetails: {
              create: selectedSeats.map((seat) => ({ seatId: seat.id })),
            },
          },
        });

        await prisma.payment.create({
          data: {
            reservationId: reservation.id,
            token: `token_${reservation.id.substring(0, 8)}`,
            redirectUrl: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${reservation.id.substring(0, 8)}`,
            status: paymentStatus,
            createdAt: createAt,
            updatedAt: createAt,
          },
        });

        if (reservationStatus === "CONFIRMED") {
          await prisma.seatsOnShowTimes.updateMany({
            where: {
              showTimeId: showTime.id,
              seatId: { in: selectedSeats.map((s) => s.id) },
            },
            data: { status: "RESERVED" },
          });
        }

        reservationsCount++;
      }
    }
  }

  console.log(
    `Seeded ${reservationsCount} reservations across past showtimes!`,
  );
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
