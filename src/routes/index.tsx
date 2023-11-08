import {
  For,
  Suspense,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  untrack,
  useContext,
} from "solid-js";
import { useSearchParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import ClassesTable from "~/components/ClassesT";
import { tCategory, tSubs } from "~/i18n/dict";
import { Category, Class, LocaleTypes, Teacher } from "~/types";

import { ComboBox } from "~/components/ComboBox3";
import { Icon } from "solid-heroicons";
import { xCircle } from "solid-heroicons/solid";
import { getCategories, getClasses, getTeachers } from "~/data/directus";
import { useNavigate } from "@solidjs/router";

type CourseCategories = {
  [category: string]: Class[];
};

const myCourse = {
  id: "1",
  title: "title",
  category: "category",
  startTime: "startTime",
  weekDays: ["weekDays"],
  duration: 1,
  level: "level",
  teacher: "teacher",
  icon: <div>icon</div>,
};

// : {
//   classes: Class[];
//   teachers: Teacher[];
//   categories: Category[];
// }
export const routeData = () => {
  return createServerData$(async (_, event) => {
    const locale = "es";

    const [classes, teachers, categories] = await Promise.all([
      getClasses() as Promise<Class[]>,
      getTeachers() as Promise<Teacher[]>,
      getCategories(locale) as Promise<Category[]>,
    ]);

    return {
      classes,
      teachers,
      categories,
    };
  });
};

const LangContext = createContext("es");

export default function Horarios() {
  const locale: LocaleTypes = useContext(LangContext) as LocaleTypes;

  const data = useRouteData<typeof routeData>();

  // console.log("route data", data()?.classes, data()?.teachers);

  const [query, setQuery] = createSignal<string>();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [classes, setClasses] = createSignal<Class[] | undefined>(
  //   ddd()?.classes
  // );
  // const [teachers, setTeachers] = createSignal<Teacher[] | undefined>(
  //   ddd()?.teachers
  // );

  // const [selectedCategories, setSelectedCategories] = createSignal<string[]>(
  //   []
  // );
  const [selectedCategory, setSelectedCategory] = createSignal<string>();
  const [selectedTeacher, setSelectedTeacher] = createSignal<string>();
  const [selectedTimeRange, setSelectedTimeRange] = createSignal("");

  const [selectionStore, setSelectionStore] = createSignal<
    Record<string, string>
  >({});

  const selected = searchParams.c?.split("|");
  // const initialData: Class[] = untrack(async () => classes);

  const [filteredData, setFilteredData] = createSignal<CourseCategories>({});
  const [filteredCategories, setFilteredCategories] = createSignal<string[]>(
    []
  );

  const parentCategory = (id: string) =>
    data()?.categories.find((c) => c.id == id);

  createEffect(() => {
    const cat = selectedCategory();
    const teacher = selectedTeacher();
    const uniqueCategories = new Set<string>();

    const classes =
      !cat && !teacher
        ? {}
        : untrack(() =>
            data()?.classes.reduce((acc, row) => {
              if (teacher && !row.teachers.includes(teacher)) {
                return acc;
              }
              if (
                cat &&
                row.category !== cat &&
                cat != parentCategory(row.category)?.parent
              ) {
                return acc;
              }

              const rowWithSelected = {
                ...row,
                selected: selected?.includes(row.id) || false,
              };

              const category = row["category"];

              if (acc[category]) {
                acc[category].push(rowWithSelected);
              } else {
                acc[category] = [rowWithSelected];
              }
              console.log("clll", rowWithSelected);

              uniqueCategories.add(category);
              return acc;
            }, {} as CourseCategories)
          );

    // // const uniqueSubCategories = new Set<string>();

    // for (const categoryKey in classes) {
    //   const category = categoryKey as string;
    //   uniqueCategories.add(category);

    //   const subCategoriesObj = classes[category];

    //   for (const subCategoryKey in subCategoriesObj) {
    //     const subCategory = subCategoryKey as string;
    //     uniqueSubCategories.add(subCategory);
    //   }
    // }

    // Convert uniqueCategories and uniqueSubCategories to an array of arrays
    // const categoriesArray = Array.from(uniqueCategories).map((category) => [
    // category,
    // ...Array.from(uniqueSubCategories),
    // ]);

    console.log(
      "change ...",
      // selectedCategory(),
      selectedTeacher(),
      // categoriesArray,
      // data?.length,
      classes
    );
    setFilteredCategories(Array.from(uniqueCategories));
    setFilteredData(classes || {});
  });

  const navigate = useNavigate();

  //   <div class="flex flex-col gap-2">

  //   <Suspense>
  //   {categories() && (    <ComboBox
  //         options={categories().map((o) => ({
  //           label: o.values[locale] || o.id,
  //           value: o.id,
  //         }))}
  //         selected={selectedCategory}
  //         setSelected={setSelectedCategory}
  //         placeholder="Select a category"
  //       />}
  //   </Suspense>
  //   {teachers() && (
  //     <ComboBox
  //       options={Object.keys(teachers()).map((teacherKey) => ({
  //         label: (teachers() as any)[teacherKey] || teacherKey,
  //         value: teacherKey,
  //       }))}
  //       selected={selectedTeacher}
  //       setSelected={setSelectedTeacher}
  //       placeholder="Filter by teacher"
  //     />
  //   )}
  // </div>

  return (
    <main
      class="mx-auto flex max-w-7xl items-center justify-between md:p-6 lg:px-8"
      aria-label="Global"

      // class="text-center mx-auto text-gray-700 p-4"
    >
      <div class="prose mx-auto ">
        <div class="flex flex-col gap-2">
          {data()?.categories && (
            <ComboBox
              options={data()?.categories.filter((c) => !c.parent) || []}
              selected={selectedCategory}
              setSelected={setSelectedCategory}
              placeholder="Select a category"
            />
          )}

          <ComboBox
            // options={Object.keys(teachers).map((teacherKey) => ({
            // label: (teachers as any)[teacherKey] || teacherKey,
            // value: teacherKey,
            // }))}
            options={
              data()?.teachers.map((t) => ({ id: t.label, label: t.label })) ||
              []
            }
            selected={selectedTeacher}
            setSelected={setSelectedTeacher}
            placeholder="Filter by teacher"
          />
        </div>
        <div>
          selected....{[selectedCategory(), selectedTeacher()].join(",")}
          <For each={filteredCategories()}>
            {(catId) => {
              const category = data()?.categories.find(
                (cat) => cat.id == catId
              );
              return (
                <>
                  {/* {selectedCategory() === category && ( */}
                  {!category?.parent && (
                    <h2 id={category?.id} class="px-2">
                      {category?.label || ""}
                    </h2>
                  )}

                  {category?.parent && (
                    <h3 class="px-4 text-slate-400">{category.label}</h3>
                  )}
                  <ClassesTable
                    category={catId}
                    // subCategory={category}
                    data={() => filteredData()[catId]}
                    setSelectionStore={setSelectionStore}
                    selectionStore={selectionStore}
                    highlightTerms={
                      selectedTeacher()
                        ? [selectedTeacher() as string]
                        : undefined
                    }
                  />
                </>
              );
            }}
          </For>
        </div>
      </div>
      <span class="h-20">.</span>
    </main>
  );
}

{
  /* <CategoryClasses
                category={category}
                data={() => dataByCategoryStore[category]}
              /> */
}
