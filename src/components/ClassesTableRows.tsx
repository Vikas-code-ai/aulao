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

import { Duration, Time } from "./Duration";
import { t, tLevel } from "~/i18n/dict";
import { Accessor, createSignal } from "solid-js";
import { Icon } from "solid-heroicons";
import { checkCircle } from "solid-heroicons/solid";
import { Class, Teacher } from "~/types";

type CourseNameWithTeacherProps = {
  course: Class;
  teachers: Accessor<Teacher[]>;
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
      {course.teachers}
    </p>
  </>
);

const TimeCell = (props: {
  selected: boolean;
  starttime: string;
  duration: number;
}) => (
  <div class="flex flex-col">
    <span class={"mt-4 text-s" + props.starttime ? "" : "text-gray-500"}>
      <Time starttime={props.starttime} duration={props.duration} />
    </span>
    <Duration minutes={props.duration} />
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

const columns: ColumnDef<Class>[] = [
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
    // id: "teachers",
    accessorKey: "teachers",
    // cell: (c) => JSON.stringify(c.getValue()),
    // ).join("."),
    cell: (cell) => (
      <div
        class="text-xs"
        innerHTML={(cell.getValue() as string[])
          .map((t) => {
            // console.log(
            //   "meta",
            //   (cell.table.options.meta as any)?.highlightTerms
            // );

            return (cell.table.options.meta as any)?.highlightTerms?.includes(t)
              ? `<strong>${t}</strong>`
              : t;
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
    accessorFn: (row) => row.weekdays.map((day) => t["weekday"](day)),
    cell: (days) => (
      <div innerHTML={(days.getValue() as string[]).join("<br />")} />
    ),
  },
  {
    header: t["time"] as any,
    // accessorKey: "startTime",
    // footer: (props) => props.column.id,

    accessorFn: (row) => ({
      startTime: row.starttime,
      duration: row.duration,
    }),
    id: "starttime",
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
        starttime={(c.getValue() as any).startTime}
        duration={(c.getValue() as any).duration}
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
  data: () => Class[];
  columnFilters: Accessor<ColumnFiltersState>;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  rowSelection: Accessor<RowSelectionState>;
  setRowSelection: OnChangeFn<RowSelectionState>;
  highlightTerms?: string[];
};

export const ClassesTableRows = ({
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
      my: () => true,
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
