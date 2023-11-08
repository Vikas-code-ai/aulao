import clsx from "clsx";
import { Icon } from "solid-heroicons";

import {
  arrowDownCircle,
  arrowPath,
  arrowUpCircle,
  barsArrowDown,
  barsArrowUp,
} from "solid-heroicons/solid";

import {
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/solid-table";

import { For, Show, createEffect, createSignal, untrack } from "solid-js";
import { DanceClass } from "./DanceClass";
import { makeData } from "~/utils/makeData";
import { CoursesSolidTable } from "./Table";
import { Course, LocaleTypes } from "~/types";
import { t } from "~/i18n/dict";
import { Filter } from "./Filter";

// export type Course = {
//   id: string;
//   startTime: string;
//   weekDays: string[];
//   duration: number;
//   level: string;
//   teacher: string;
//   icon: JSX.Element;
// };

const statuses = {
  Paid: "text-green-700 bg-green-50 ring-green-600/20",
  Withdraw: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Overdue: "text-red-700 bg-red-50 ring-red-600/10",
};

export default function DanceClasses() {
  // const browsersLang = (!!navigator && "en") || "es";
  // (!!navigator && (navigator.language.split("-")[0] as Language)) || "en";
  // const [lang, setLang] = createSignal<LocaleTypes>(
  //   locales.includes(browsersLang) ? browsersLang : "en"
  // );
  const [data, setData] = createSignal<Course[]>(makeData(10));
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [filter, setFilter] = createSignal<ColumnFiltersState>([]);
  const [categoryFilter, setCategoryFilter] = createSignal<string[]>([]);
  const [categories, setCategories] = createSignal<string[]>();
  const refreshData = () => setData(makeData(10));

  const selectCourse = (id: string, selected: boolean) => {
    setData(
      data().map((c) => {
        if (c.id == id) {
          c.selected = selected;
        }
        return c;
      })
    );
  };

  const coursesTable = CoursesSolidTable({
    data,
    sorting,
    setSorting,
    columnFilters: filter,
    setColumnFilters: setFilter,
  });

  // const categories = Array.from(
  //   new Set(data().map((course) => course.category))
  // );

  createEffect(() => {
    setCategories(Array.from(new Set(data().map((course) => course.category))));
  });

  createEffect(() => {
    setFilter([
      ...untrack(() => filter().filter((f) => f.id !== "category")),
      {
        id: "category",
        value: categoryFilter(),
      },
    ]);
    console.log("filter", filter());
  });

  const selectedRowModel = coursesTable.getSelectedRowModel;

  type Arow = { id: string; value: string };
  type Brow = Record<string, boolean>;

  // createEffect(() => {
  //   const rowSelection = coursesTable.getState().rowSelection;
  //   const k = Object.keys(rowSelection);
  //   const currentData = data();
  //   k.map((i) => currentData[parseInt(i)]);

  //   setSearchParams({
  //     c: k.map((i) => currentData[parseInt(i)].id).join("|"),
  //     // k.map(index: string => data()[parseInt(index)])

  //     //   c: data()
  //     //     .map((_, index) => )
  //     //     .join("|"),
  //     // });
  //   });
  // });

  return (
    <div>
      <pre>
        row selection:{JSON.stringify(coursesTable.getState().rowSelection)}
      </pre>
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">
          Recent activity
        </h2>
      </div>
      // checkboxes of categories
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mx-auto overflow-x-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div class="flex flex-wrap gap-2">
            <For each={categories()}>
              {(category) => (
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    class="form-checkbox h-5 w-5 text-gray-600"
                    value={category}
                    onChange={(e) => {
                      const { checked, value } = e.currentTarget;
                      if (checked) {
                        setCategoryFilter([...categoryFilter(), value]);
                      } else {
                        setCategoryFilter(
                          categoryFilter().filter((v) => v !== value)
                        );
                      }
                    }}
                    // checked={coursesTable.getIsCategoryVisible(category)}
                    // onChange={() =>
                    //   coursesTable.toggleCategoryVisibility(category)
                    // }
                  />
                  <span class="ml-2 text-gray-700">
                    {/* {t.title()} */}
                    {category} //
                    {t[`cat.${category}`]()} //
                    {/* {Category[category as keyof typeof Category] || category} */}
                  </span>
                </label>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="mt-6 overflow-hidden border-t border-gray-100">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mx-auto overflow-x-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <table class="w-full text-left table table-xs table-pin-rows table-pin-cols">
              <thead>
                <For each={coursesTable.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(header) => (
                          <th colSpan={header.colSpan}>
                            <Show when={!header.isPlaceholder}>
                              <div
                                class={
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : undefined
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: "▲",
                                  // asc: (
                                  //   <Icon
                                  //     path={barsArrowUp}
                                  //     style="width: 20px; color: yellow"
                                  //   />
                                  // ),
                                  desc: "▼",
                                  // desc: (
                                  //   <>
                                  //     {/* <Icon
                                  //       path={arrowDown}
                                  //       style="width: 20px; color: yellow"
                                  //     /> */}

                                  //     {/* <barsArrowDown /> */}
                                  //     <Icon
                                  //       path={barsArrowDown}
                                  //       style="width: 20px; color: yellow"
                                  //     />
                                  //   </>
                                  // ),
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </div>
                            </Show>
                          </th>
                        )}
                      </For>
                    </tr>
                  )}
                </For>

                <For each={coursesTable.getHeaderGroups()}>
                  {(headerGroup) => (
                    <tr>
                      <For each={headerGroup.headers}>
                        {(header) =>
                          header.column.getCanFilter() ? (
                            <td>
                              <Filter
                                column={header.column}
                                table={coursesTable}
                              />
                            </td>
                          ) : null
                        }
                      </For>
                    </tr>
                  )}
                </For>
              </thead>
              <tbody>
                {/* <For each={courses}>
                  {(course, index) => (
                    <DanceClass index={index} course={course} />
                  )}
                </For> */}

                <For each={coursesTable.getRowModel().rows.slice(0, 10)}>
                  {(row) => (
                    <tr>
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <td>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <pre class="text-left">
        {JSON.stringify(coursesTable.getState(), null, 2)}
      </pre>
    </div>
  );
}
