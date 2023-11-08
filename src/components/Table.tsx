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

import DanceClass from "./DanceClass";
import { createEffect, createSignal } from "solid-js";
import { makeData } from "~/utils/makeData";
import { Time } from "./Duration";
import { t, tCategory } from "~/i18n/dict";

type CourseNameWithTeacherProps = {
  course: DanceClass;
};

declare module "@tanstack/table-core" {
  interface FilterFns {
    my: FilterFn<unknown>;
  }
}

const CourseNameWithTeacher = ({ course }: CourseNameWithTeacherProps) => (
  <>
    <div class="flex gap-x-3 w-8 h-8">ic</div>
    <div class="ml-8">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        {course.title}
      </h3>
      <p class="mt-2 text-sm text-gray-500">{course.teacher}</p>
    </div>
  </>
);

const TimeCell = (props: { minutes: number; duration: number }) => (
  <div class="flex flex-col">
    <span class="text-sm text-gray-500">
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

function IndeterminateCheckbox({
  indeterminate,
  clname = "",
  ...rest
}: IndeterminateCheckboxProps) {
  // const ref = createRef<HTMLInputElement>()
  let inputElementRef: any = <input type="checkbox" />;
  // | ((el: HTMLInputElement) => void) | undefined;

  createEffect(() => {
    if (typeof indeterminate === "boolean") {
      inputElementRef.indeterminate = !rest.checked && indeterminate;
    }
  });

  return (
    <input
      type="checkbox"
      ref={inputElementRef}
      // class={class + " cursor-pointer"}
      class={clname + " cursor-pointer"}
      {...rest}
    />
  );
}

const columns: ColumnDef<Course>[] = [
  {
    header: "Name",
    footer: (props) => props.column.id,

    columns: [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div class="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },

      // {
      //   header: " / ",
      //   //accessorFn: (row) => ({ id: row.id, selected: row.selected }),
      //   id: "title",
      //   cell: (c) => (
      //     <input
      //       type="checkbox"
      //       name={c.getValue().id}
      //       checked={c.getValue().selected}
      //     />
      //   ),
      // },

      {
        header: "Title",
        accessorFn: (row) => ({ title: row.title, teacher: row.teacher }),
        id: "title",
        cell: (c) => <CourseNameWithTeacher course={c.getValue()} />,
      },
      {
        header: "Level",
        // filterFn: "my",
        accessorKey: "level",
      },
      {
        header: () => <span>Week Days</span>,
        accessorKey: "weekDays",
        accessorFn: (row) => row.weekDays.join(", "),
      },
      {
        header: "Category",
        accessorKey: "category",
        filterFn: "my",
        // filterFn: "equals",
        // filterFn: () => false,
        accessorFn: (row) => tCategory(row.category),
      },
      {
        header: "Time",
        // accessorKey: "startTime",
        // footer: (props) => props.column.id,

        accessorFn: (row) => ({
          startTime: row.startTime,
          duration: row.duration,
        }),
        id: "startTime",

        sortingFn: (rowA, rowB) =>
          rowA.original.startTime - rowB.original.startTime,
        cell: (c) => (
          <TimeCell
            minutes={c.getValue().startTime}
            duration={c.getValue().duration}
          />
        ),
      },
    ],
  },
];

// const [data, setData] = createSignal(makeData(50));
// const [sorting, setSorting] = createSignal<SortingState>([]);
// const refreshData = () => setData(makeData(50));

const [rowSelection, setRowSelection] = createSignal<RowSelectionState>();

type TableProps = {
  data: () => DanceClass[];
  sorting: () => SortingState;
  columnFilters: () => ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  setSorting: OnChangeFn<SortingState>;
};

// const [filter, setFilter] = createSignal<ColumnFiltersState>([]);

export const CoursesSolidTable = ({
  data,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
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
      my: (row, columnId, filterValue) => {
        return filterValue.length > 0
          ? filterValue.includes(row.original[columnId])
          : true;
        // return true;
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
