import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  RowSelectionState,
  ColumnFiltersState,
  ColumnDef,
  createSolidTable,
  Row,
  CellContext,
  Table,
  OnChangeFn,
  FilterFn,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
} from "@tanstack/solid-table";
import Course from "./DanceClass";

import { Time } from "./Duration";
import { t, tLevel } from "~/i18n/dict";
import { Accessor, createSignal } from "solid-js";
import { Icon } from "solid-heroicons";
import { checkCircle } from "solid-heroicons/solid";
import { teachers } from "~/utils/someData";

type CourseNameWithTeacherProps = {
  course: Course;
  selected: boolean;
};

declare module "@tanstack/table-core" {
  interface FilterFns {
    level: FilterFn<unknown>;
  }
}

const CourseNameWithTeacher = ({
  course,
  selected,
}: CourseNameWithTeacherProps) => (
  <>
    <p class={"mt-4 text-s" + selected ? "" : "text-gray-500"}>
      {course.teacher}
    </p>
  </>
);

const TimeCell = (props: {
  selected: boolean;
  minutes: number;
  duration: number;
}) => (
  <div class="flex flex-col">
    <span class={"mt-4 text-s" + props.minutes ? "" : "text-gray-500"}>
      <Time minutes={props.minutes} /> -{" "}
      <Time minutes={props.minutes + props.duration} />
    </span>
    <Time minutes={props.duration} isDuration={true} />
  </div>
);

type IndeterminateCheckboxProps = {
  indeterminate?: boolean;
  clname?: string;
  onChange?: (event: Event) => void;
  checked?: boolean;
  name?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoFocus?: boolean;
  form?: string;
  tabIndex?: number;
  accessKey?: string;
  title?: string;
  id?: string;
  style?: string;
};

const columns: ColumnDef<Course>[] = [
  // },

  // {
  //   header: "Category",
  //   accessorKey: "category",
  //   // enableGrouping: true,
  //   id: "category",
  //   accessorFn: (row) => ({
  //     category: row.category,
  //     subCategory: row.subCategory,
  //   }),
  //   cell: (c) => (
  //     <div class="flex flex-row">
  //       <span>{tCategory(c.getValue().category)}</span>
  //       <span>{tCategory(c.getValue().subCategory)}</span>
  //     </div>
  //   ),
  // },
  {
    header: "",
    id: "selected",
    accessorFn: (row) => row.selected,
    sortingFn: (rowA, rowB) =>
      rowA.getIsSelected() === rowB.getIsSelected()
        ? 0
        : !rowA.getIsSelected()
        ? -1
        : 1,
    cell: ({ row }) => (
      <div class="px-1">
        {row.getIsSelected() ? (
          <Icon path={checkCircle} class="w-4 h-4 text-purple-400" />
        ) : (
          <></>
        )}
        {/* <input class="checkbox" type="checkbox" checked={row.getIsSelected()} /> */}
      </div>
    ),
  },
  {
    header: t["teacher"] as any,
    id: "teacher",
    accessorFn: (row) =>
      typeof row.teacher == "string" ? [row.teacher] : row.teacher,
    cell: (cell) => (
      <div
        class="text-xs"
        innerHTML={(cell.getValue() as string[])
          .map((tk) => {
            const teacher = (teachers as any)[tk];

            console.log(
              "meta",
              (cell.table.options.meta as any)?.highlightTerms
            );

            return (cell.table.options.meta as any)?.highlightTerms?.includes(
              tk
            )
              ? `<strong>${teacher}</strong>`
              : teacher;
          })
          .join(" | ")}
      />
    ),
  },
  {
    header: t["level"] as any,
    filterFn: "level",
    accessorKey: "level",
    sortDescFirst: false,
    cell: (c) => (
      <span
        class={`badge badge-lg text-xs h-auto text-center level-${c.getValue()}`}
      >
        {tLevel(c.getValue() as string)}
      </span>
    ),

    // `${tLevel(c.getValue())}`,
  },
  {
    header: () => t["Days"],
    accessorKey: "weekDays",
    accessorFn: (row) => row.weekDays.map((day) => t["weekday"](day)),
    cell: (days) => <div innerHTML={days.getValue().join("<br />")} />,
  },
  {
    header: t["time"] as any,
    // accessorKey: "startTime",
    // footer: (props) => props.column.id,

    accessorFn: (row) => ({
      startTime: row.startTime,
      duration: row.duration,
    }),
    id: "startTime",
    // sortingFn: (rowA, rowB) =>
    // rowA.original.startTime - rowB.original.startTime,
    // sortingFn: (rowA, rowB) =>
    //   Number(rowA.original.selected) === Number(rowB.original.selected)
    //     ? 0
    //     : rowA.original.selected
    //     ? -1
    //     : 1,

    cell: (c) => (
      <TimeCell
        selected={c.row.getIsSelected()}
        minutes={c.getValue().startTime}
        duration={c.getValue().duration}
      />
    ),
  },
];

const [sorting, setSorting] = createSignal<SortingState>([
  {
    id: "level",
    desc: false,
  },
]);

type TableProps = {
  data: () => Course[];
  columnFilters: Accessor<ColumnFiltersState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  rowSelection: Accessor<RowSelectionState>;
  setRowSelection: OnChangeFn<RowSelectionState>;
  highlightTerms?: string[];
};

export const CoursesTable = ({
  data,
  columnFilters,
  setColumnFilters,
  rowSelection,
  setRowSelection,
  highlightTerms,
}: TableProps) =>
  createSolidTable({
    debugAll: true,

    get data() {
      return data();
    },
    columns,
    enableFilters: true,
    enableRowSelection: true,
    enableColumnFilters: true,
    // filterFns: () => ({
    // type FilterFns = Record<string, (value: any, filterValue: any) => boolean>;

    filterFns: {
      level: (row, columnId, filterValue) => {
        console.log(
          "level filter",
          row.original,
          row.original[columnId],
          filterValue
        );

        return filterValue.length > 0
          ? filterValue.includes(row.original[columnId])
          : true;
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      get columnFilters() {
        return columnFilters();
      },
      get sorting() {
        return sorting();
      },
      get rowSelection() {
        return rowSelection();
      },
    },
    meta: {
      highlightTerms,
    },
    onStateChange(updater) {},
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    getFilteredRowModel: getFilteredRowModel(),

    // getPaginationRowModel: getPaginationRowModel(),
    // getFacetedRowModel: getFacetedRowModel(),
    // getFacetedUniqueValues: getFacetedUniqueValues(),
    // getFacetedMinMaxValues: getFacetedMinMaxValues(),
    // filterFns: {
    //   category: (row, filterValue) =>
    //     filterValue.includes(row.getValue().category),
    // },
    debugTable: true,
  });
