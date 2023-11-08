import {
  flexRender,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/solid-table";

import {
  Accessor,
  For,
  Show,
  createEffect,
  createSignal,
  untrack,
} from "solid-js";
import { Course, LocaleTypes } from "~/types";
import { t, tLevel } from "~/i18n/dict";
import { Filter } from "./Filter";
import { CoursesTable } from "./_CoursesTable";

type ClassesTableProps = {
  category: string;
  subCategory: string;

  data: () => Course[];
  setSelectionStore: (value: Record<string, string>) => void;
  selectionStore: Accessor<Record<string, string>>;
  highlightTerms?: string[];
};
export default function ClassesTable({
  category,
  subCategory,
  data,
  setSelectionStore,
  selectionStore,
  highlightTerms,
}: ClassesTableProps) {
  const [filter, setFilter] = createSignal<ColumnFiltersState>([]);
  const [levelFilter, setLevelFilter] = createSignal<number[]>([]);
  const [levels, setLevels] = createSignal<number[]>([]);
  const [rowSelection, setRowSelection] = createSignal<RowSelectionState>({});

  const coursesTable = CoursesTable({
    data,
    columnFilters: filter,
    setColumnFilters: setFilter,
    rowSelection,
    setRowSelection,
    highlightTerms,
  });

  createEffect(() => {
    setLevels(
      Array.from(new Set(data().map((course) => course.level))) as number[]
    );
  });

  createEffect(() => {
    setFilter([
      ...untrack(() => filter().filter((f) => f.id !== "level")),
      {
        id: "level",
        value: levelFilter(),
      },
    ]);
  });

  // const selectionRows = createMemo(() => {
  createEffect(() => {
    const rowSelection = coursesTable.getState().rowSelection;
    const k = Object.keys(rowSelection);
    console.log(
      "rowSelection",
      k,
      rowSelection,

      k[0] && data()[Number(k[0]) as number]
    );
    console.log("model selected row", coursesTable.getSelectedRowModel().rows);
    setSelectionStore({
      ...untrack(() => selectionStore()),
      [`${category}.${subCategory}`]: coursesTable
        .getSelectedRowModel()
        .rows.map((r) => r.original.id)
        .join("|"),
    });
  });

  // createEffect(() => {
  //   console.log("selectionRows effect", category, selectionRows().d);
  //   // setSearchParams( ...searchParams, {
  //   //   [category]: selectionRows().map((c) => c.id).join("|"),
  //   // });
  // });

  return (
    <>
      {/* <pre>{JSON.stringify(coursesTable.getState().rowSelection)}</pre> */}
      {levels().length > 2 && data().length > 5 && (
        <div class="px-4">
          <LevelSelectors
            levels={levels}
            setLevelFilter={setLevelFilter}
            levelFilter={levelFilter}
          />
        </div>
      )}
      {/* <div class="mt-6 overflow-hidden border-t border-gray-100"> */}
      {/* <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> */}
      {/* <div class="mx-auto overflow-x-auto max-w-2xl lg:mx-0 lg:max-w-none"> */}
      <table class="table w-full text-left table-xs table-pin-rows table-pin-cols">
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
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </Show>
                    </th>
                  )}
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

          <For each={coursesTable.getRowModel().rows.slice(0, 100)}>
            {(row) => {
              return (
                <tr
                  class={
                    row.getIsSelected() ? "hover bg-base-300 text-white" : ""
                  }
                  onclick={() => row.toggleSelected()}
                >
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
              );
            }}
          </For>
        </tbody>
      </table>
      {/* </div> */}
      {/* // </div> */}
      {/* // </div> */}
      {/* <pre class="text-left"> */}
      {/* {JSON.stringify(coursesTable.getState(), null, 2)} */}
      {/* </pre> */}
    </>
  );
}
interface LevelSelectorsProps {
  levels: () => number[];
  levelFilter: () => number[];
  setLevelFilter: (value: number[]) => void;
}

const LevelSelectors = ({
  levels,
  levelFilter,
  setLevelFilter,
}: LevelSelectorsProps) => (
  <For each={levels()}>
    {(level) => (
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          class="form-checkbox h-5 w-5 text-gray-600"
          value={level}
          onChange={(e) => {
            const { checked, value } = e.currentTarget;
            const intValue = parseInt(value);
            if (checked) {
              // console.log("typeof", typeof value, value);
              setLevelFilter([...levelFilter(), intValue]);
            } else {
              setLevelFilter(levelFilter().filter((v) => v !== intValue));
            }
          }}
        />
        <span class={`badge level-${level} text-xs ml-1  text-gray-700`}>
          {level && tLevel(level.toString())}
        </span>
      </label>
    )}
  </For>
);
