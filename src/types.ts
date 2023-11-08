import { JSX } from "solid-js";

export interface Course {
  id: string;
  isTapProgram?: boolean;
  selected?: boolean;
  title: string;
  category: string;
  subCategory?: string;
  startsAt?: Date;
  startTime: number;
  weekDays: number[];
  duration: number;
  level?: number;
  teacher: string | string[];
}

// export interface Class {
//   id: number;
//   selected?: boolean;
//   formacion?: boolean;
//   title: string;
//   category: string;
//   subCategory?: string;
//   starttime: number;
//   duration: number;
//   startdate?: Date;
//   enddate?: Date;
//   level?: number;
//   weekdays: number[];

//   ocupacion?: string;
//   // teacher: string | string[];
//   teachers: Teacher[];
// }

export interface Class {
  id: string;
  title?: string;
  selected?: boolean;
  starttime: number;
  duration: number;
  startdate?: Date;
  enddate?: Date;
  level?: number;
  formacion?: boolean;
  weekdays: number[];
  category: string;
  ocupacion?: string;
  teachers: string[];
}

export interface Option {
  id: string;
  label: string;
}

export interface Teacher extends Option {}
export interface DbTeacher {
  id: string;
  name: string;
}

export interface ClassTeacher {
  id: number;
  classesId: number;
  teacherId: string;
  sort: number;
}

export interface Category extends Option {
  id: string;
  parent?: string;
}

export type DbCategory = Category & {
  sort: number;
  enabled: boolean;
  name: string;
  label: Translations;
};

export interface Level {
  id: number;
  label: string;
}

export type LocaleTypes = "en" | "es" | "cat";
export interface Translations {
  es?: string;
  en?: string;
  cat?: string;
}
