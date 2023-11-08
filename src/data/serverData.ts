import { createServerData$ } from "solid-start/server";
import { getCategories, getClasses, getTeachers } from "./directus";

export function teachersData() {
  return createServerData$(() => getTeachers());
}

export function classesData() {
  return createServerData$(() => getClasses());
}

export function categoriesData() {
  return createServerData$(() => getCategories());
}
