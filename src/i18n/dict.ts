import { createChainedI18n } from "@solid-primitives/i18n";
import { Categories, Subs } from "./categories";
import { Levels } from "./levels";
import { LocaleTypes } from "~/types";

const weekDayFn = (locale: string) => (day: number) => WeekDays[locale][day];

// const categoryEn = Object.keys(Category).map((key: string) => ({
//   [key as keyof typeof Category]: Category[key as keyof typeof Category].en,
// }));

type keyValePair = {
  [key: string]: string;
};

// const categoriesByLocale = (locale: LocaleTypes) =>
//   Object.keys(Categories).reduce<keyValePair>((acc, key) => {
//     acc[`cat.${key}`] = Categories[key as keyof typeof Categories][locale];
//     return acc;
//   }, {});

// const subsByLocale = (locale: LocaleTypes) =>
//   Object.keys(Subs).reduce<keyValePair>((acc, key) => {
//     acc[`cat.${key}`] = Subs[key as keyof typeof Subs][locale];
//     return acc;
//   }, {});

// const levelsByLocale = (locale: LocaleTypes) =>
//   Object.keys(Levels).reduce<keyValePair>((acc, key) => {
//     // const k = `level.${key}`;
//     acc[`level.${key}`] = Levels[parseInt(key) as keyof typeof Levels][locale];
//     return acc;
//   }, {});

const prefixDictByLocale = (
  l: LocaleTypes,
  dict: Record<any, Record<string, string>>,
  prefix?: string
) =>
  Object.keys(dict).reduce<keyValePair>((acc, key) => {
    acc[`${!prefix ? "" : prefix + "."}${key}`] =
      dict[key as keyof typeof dict][l];
    return acc;
  }, {});

// const categoriesByLocale = (locale: LocaleTypes) =>
//   Object.keys(Category).map((key) => ({
//     [key as keyof typeof Category]:
//       Category[key as keyof typeof Category][locale],
//   }));
// .reduce<keyValePair>((acc, key) => {;

const dictionaries = {
  en: {
    title: "Dance Classes",
    time: "Time",
    teacher: "Teacher",
    level: "Level",
    Days: "Days",
    weekday: weekDayFn("en"),
    ...prefixDictByLocale("en", Categories, "cat"),
    ...prefixDictByLocale("en", Subs, "cat"),
    ...prefixDictByLocale("en", Levels, "level"),
  },
  es: {
    title: "Clases de Baile",
    time: "Hora",
    teacher: "Profesor",
    level: "Nivel",
    Days: "Días",
    weekday: weekDayFn("es"),
    ...prefixDictByLocale("es", Categories, "cat"),
    ...prefixDictByLocale("es", Subs, "cat"),
    ...prefixDictByLocale("es", Levels, "level"),
  },
  cat: {
    title: "Classes de Ball",
    time: "Hora",
    teacher: "Professor",
    level: "Nivell",
    Days: "Dies",
    weekday: weekDayFn("cat "),
    ...prefixDictByLocale("cat", Categories, "cat"),
    ...prefixDictByLocale("cat", Subs, "cat"),
    ...prefixDictByLocale("cat", Levels, "level"),
  },
};

export const [t, { locale, setLocale, getDictionary }] = createChainedI18n({
  dictionaries,
  locale: "es", // Starting locale
});

export const tByKey = (key: string, value?: string | number) =>
  !value || !t[`${key}.${value}`] ? "" : (t[`${key}.${value}`]() as string);

export const tCategory = (category?: string) => tByKey("cat", category);
export const tSubs = (sub: string) => tByKey("cat", sub);
export const tLevel = (level?: string) => tByKey("level", level);

// export const tCategory = (category?: string) =>
//   !category || !t[`cat.${category}`] ? "" : (t[`cat.${category}`]() as string);
// export const tSubs = (sub: string) => t[`cat.${sub}`]() as string;
// export const tLevel = (level?: string) =>
//   !level || !t[`level.${level}`] ? "" : (t[`level.${level}`]() as string);

interface WeekDays {
  [key: string]: string[];
}
const WeekDaysLong: WeekDays = {
  en: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  es: [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ],
  cat: [
    "Dilluns",
    "Dimarts",
    "Dimecres",
    "Dijous",
    "Divendres",
    "Dissabte",
    "Diumenge",
  ],
};
const WeekDays: WeekDays = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  cat: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
};
