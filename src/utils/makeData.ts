import { faker } from "@faker-js/faker";
import { CourseIcons, WeekDays } from "~/constants";
import { Categories, Subs } from "~/i18n/categories";
import { Levels } from "~/i18n/levels";
import { Course } from "~/types";

const subs = Object.keys(Subs).filter((key) => !key.startsWith("tap"));
const forSubCategories = ["0", "2", "3"];
// const categoriesWithouSubs = Object.keys(Categories).filter(
//   (key) => !forSubCategories.includes(key)
// );

const iconsList = Object.values(CourseIcons);
export function newCourse(): Course {
  // const roundedMinutes = Math.round(startTimeInMinutes / 15) * 15;
  // faker.helpers.shuffle(["00", "15", "30", "45"]).slice(0, 1)[0]

  const shuffle = (c: string[]) => faker.helpers.shuffle(c).slice(0, 1)[0];
  const category = shuffle(
    Object.keys(Categories).filter((key) => key !== "tap")
  );

  const level = parseInt(faker.helpers.shuffle(Object.keys(Levels))[0]);
  const teacher = faker.person.fullName();
  return {
    id: faker.string.nanoid({ min: 3, max: 4 }),
    category,
    subCategory: shuffle(subs),
    level,
    teacher,
    selected: false,
    title: `${teacher} | ${category} | ${level}`,
    startTime: Math.round((faker.number.int(12 * 60 + 45) + 9 * 60) / 15) * 15,

    weekDays: [faker.number.int(6) + 1, faker.number.int(6) + 1].slice(
      0,
      faker.number.int(1) + 1
    ),

    // weekDays: faker.helpers.shuffle(faker.person.firstName, {min: 1, max:2 }),
    duration: faker.helpers
      .shuffle([45, 60, 60, 60, 60, 60, 90, 90, 90, 90, 90, 90, 75, 75])
      .slice(0, 1)[0],
  };
}

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Course[] => {
    const len = lens[depth]!;
    return range(len).map((d): Course => {
      return {
        ...newCourse(),
      };
    });
  };

  return makeDataLevel();
  //  return tapClasses.push(...makeDataLevel());
}
