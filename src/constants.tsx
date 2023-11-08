import { Categories } from "./i18n/categories";

export const locales = ["en", "es", "cat"];
export const defaultLocale: string = "es";

export const WeekDays = {
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

// export const Levels =
// {
//   en: ["Beginner", "Advanced Beginner", "Intermediate", "Intermediate/Advanced", "Advanced"],
//   es: ["Principiante", "Principiantes Avanzados",  "Medio", "Medio/Avanzado", "Avanzado"],
//   cat: ["Principiant", "Principiants avançats", "Intermedi", "Mig/avançat", "Avançat"],
// }

// export const Category = {
//   tap: {
//     en: "Tap",
//     es: "Claqué",
//     cat: "Claqué",
//   },
//   ballet: {
//     en: "Ballet",
//     es: "Danza clásica",
//     cat: "Dansa clàssica",
//   },
//   jazz: {
//     en: "Jazz dance",
//     es: "Danza jazz",
//     cat: "Dansa jazz",
//   },
//   contemporary: {
//     en: "Contemporary dance",
//     es: "Danza contemporánea",
//     cat: "Dansa contemporània",
//   },
//   bodyPercussion: {
//     en: "Body percussion",
//     es: "Percusión corporal",
//     cat: "Percussió corporal",
//   },
//   streetDance: {
//     en: "Street dance",
//     es: "Danza urbana",
//     cat: "Danses urbanes",
//   },
//   irish: {
//     en: "Irish dance",
//     es: "Danza irlandesa",
//     cat: "Dansa irlandesa",
//   },
//   baroqe: {
//     en: "Baroque dance",
//     es: "Danza barroca",
//     cat: "Dansa barroca",
//   },
//   stretching: {
//     en: "Stretching",
//     es: "Estiramiento",
//     cat: "Estiraments",
//   },
//   castanets: {
//     en: "Castanets",
//     es: "Castañuelas",
//     cat: "Castanyoles",
//   },
//   authenticJazz: {
//     en: "Authentic jazz",
//     es: "Jazz auténtico",
//     cat: "Jazz autèntic",
//   },
//   balletFit: {
//     en: "Ballet fit",
//     es: "Ballet fit",
//     cat: "Ballet fit",
//   },
//   anatomy: {
//     en: "Anatomy",
//     es: "Anatomía",
//     cat: "Anatomia",
//   },
// };

export const CourseIcons = {
  tap: <svg></svg>,
  Ballet: <svg></svg>,
  HipHop: <svg></svg>,
  Jazz: <svg></svg>,
  Salsa: <svg></svg>,
  Tango: <svg></svg>,
  Tap: <svg></svg>,
};

export const categories = Object.keys(Categories);
