import { Column, Table } from "@tanstack/solid-table";
import { createEffect, createSignal } from "solid-js";
// import type { InputHTMLAttributes } from "solid-js";
import { JSX } from "solid-js";
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,

  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<JSX.HTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = createSignal(initialValue);

  createEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  createEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value());
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value()}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  // const sortedUniqueValues = React.useMemo(
  //   () =>
  //     typeof firstValue === 'number'
  //       ? []
  //       : Array.from(column.getFacetedUniqueValues().keys()).sort(),
  //   [column.getFacetedUniqueValues()]
  // )

  return typeof firstValue === "number" ? (
    <div>
      <div class="flex space-x-2">
        <DebouncedInput
          // type="number"
          // min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          // max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          // placeholder={`Min ${
          //   column.getFacetedMinMaxValues()?.[0]
          //     ? `(${column.getFacetedMinMaxValues()?.[0]})`
          //     : ''
          // }`}
          class="w-24 border shadow rounded"
        />
        <DebouncedInput
          // type="number"
          // min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          // max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          // placeholder={`Max ${
          //   column.getFacetedMinMaxValues()?.[1]
          //     ? `(${column.getFacetedMinMaxValues()?.[1]})`
          //     : ''
          // }`}
          class="w-24 border shadow rounded"
        />
      </div>
      <div class="h-1" />
    </div>
  ) : (
    <>
      datalist
      {/* <datalist id={column.id + 'list'}>
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist> */}
      <DebouncedInput
        //   type="text"

        value={(columnFilterValue ?? "") as string}
        onChange={(value) => {
          console.log("filter changed value", column.id, value);
          column.setFilterValue(value);
        }}
        onblur={(e) => {
          console.log("filter blur", column.id, e.currentTarget.value);
          column.setFilterValue(e.currentTarget.value);
        }}
        //   placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        class="w-36 border shadow rounded"
        //   list={column.id + 'list'}
      />
      <div class="h-1" />
    </>
  );
}
