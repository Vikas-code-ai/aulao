const pgp = require("pg-promise")();
const db = pgp("postgres://aulaos:aulao@localhost:5433/aulao");
const data = require("./src/utils/someData");

console.log("start import");

// Function to convert minutes to time format (HH:MM:SS)
function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(
    2,
    "0"
  )}:00`;
}

// Iterate through the data and insert into the PostgreSQL table
// data.tapClassesUnfixed.forEach(async (item) => {
//   console.log("..", item.id);
//   const {
//     id,
//     title,
//     category,
//     subCategory,
//     startTime,
//     weekDays,
//     duration,
//     level,
//     teacher,
//   } = item;
// const startTimeFormatted = minutesToTime(startTime);

// try {
// await db.none(
//   `INSERT INTO public.classes
//   (id, status, starttime, duration, level, weekdays, category)
//   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
//   [
//     id,
//     "draft",
//     // title,
//     startTimeFormatted,
//     duration,
//     level,
//     JSON.stringify(weekDays),
//     category,
//   ]
// );

try {
  // Ensure your database connection (db) is established

  const insertStatement =
    `INSERT INTO public.classes 
        (id, status, title, starttime, duration, level, weekdays, category)
        VALUES ` +
    data.tapClassesUnfixed
      .map((item) => {
        let startTimeFormatted;
        try {
          startTimeFormatted = minutesToTime(item.startTime);
        } catch (error) {
          // Handle the error by setting a default value (e.g., '12:00:00') for starttime
          startTimeFormatted = "12:00:00";
        }

        console.log(
          "UU",
          item.id,
          parseInt(startTimeFormatted.split(":")[0]) > 23,
          startTimeFormatted.split(":")[0]
        );
        startTimeFormatted =
          parseInt(startTimeFormatted.split(":")[0]) > 23
            ? "12:00:00"
            : startTimeFormatted;

        return `('${item.id}', 'draft', '${
          item.title
        }', '${startTimeFormatted}', ${item.duration}, ${
          item.level
        }, '${JSON.stringify(item.weekDays)}', '${item.category}')`;
      })
      .join(", ");
  console.log(insertStatement);
  await db.none(insertStatement);

  console.log("Data inserted successfully.");
} catch (error) {
  console.error(`Error inserting data: ${error.message}`);
}

// Close the database connection
pgp.end();
