import {
  createSignal,
  createEffect,
  createMemo,
  For,
  Accessor,
} from "solid-js";
import { check, xCircle, xMark, barsArrowDown } from "solid-heroicons/solid";
import { Icon } from "solid-heroicons";
import { tCategory } from "~/i18n/dict";

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  selected: Accessor<string[]>;
  setSelected: (options: string[]) => void;
}

export function ComboBox({ options, selected, setSelected, ...props }: Props) {
  const [searchText, setSearchText] = createSignal("");

  const add = (value: string) => {
    if (!selected().includes(value)) {
      setSelected([...selected(), value]);
      setSearchText("");
    }
  };

  const remove = (value: string) => {
    setSelected(selected().filter((option) => option !== value));
  };

  const toggleSelected = (value: string) => {
    if (selected().includes(value)) {
      remove(value);
    } else {
      add(value);
    }
  };

  const filteredOptions = createMemo(() =>
    options.filter((option) =>
      option.label.toLowerCase().includes(searchText().toLowerCase())
    )
  );
  // createEffect(() => {
  //   if (!isOpen()) {
  //     setSearchText("");
  //   }
  // });

  const isSelected = (value: string) => selected().includes(value);

  return (
    <div class="relative">
      <div class="flex flex-wrap gap-1 mx-1 mb-2">
        <For each={selected()}>
          {(selected) => (
            <span class="flex flex-row gap-1 px-1 rounded-lg bg-primary">
              <a
                class="text-white font-semibold decoration-white no-underline"
                href={`#${selected}`}
              >
                {tCategory(selected)}
              </a>
              <button onClick={() => remove(selected)}>
                <Icon path={xCircle} class="w-4 h-4 text-white bg-secondar" />
              </button>
            </span>
          )}
        </For>
      </div>
      <div class="dropdown dropdown-hover z-50">
        <label tabindex="0" class="m-0 p-0">
          <input
            tabindex="0"
            // class="btn m-1"
            type="text"
            placeholder="Select options..."
            onInput={(e) => setSearchText(e.currentTarget.value)}
          />
        </label>
        <ul
          tabindex="0"
          class="p-0 m-0 dropdown-content z-[1] menu shadow bg-base-100 rounded-box"
        >
          <For each={filteredOptions()}>
            {(option) => {
              return (
                <li
                  class={
                    "flex flex-row  pl-0 ml-0" +
                    (isSelected(option.value) ? "bg-primary " : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelected(option.value);
                  }}
                >
                  <div>
                    {isSelected(option.value) ? (
                      <Icon path={check} class="w-4 h-4 text-purple-400" />
                    ) : (
                      <span class="pl-4" />
                    )}
                    <span class="ml-4">{option.label}</span>
                  </div>
                </li>
              );
            }}
          </For>
        </ul>
      </div>
    </div>
  );
}
