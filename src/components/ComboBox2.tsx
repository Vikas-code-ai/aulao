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
  selected: Accessor<string>;
  setSelected: (options: string) => void;
  placeholder: string;
}

export function ComboBox({
  options,
  selected,
  setSelected,
  placeholder,
  ...props
}: Props) {
  const [searchTerm, setSearchTerm] = createSignal("");

  const [dropdownVisible, setDropdownVisible] = createSignal(false);

  const filteredOptions = createMemo(() =>
    options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm().toLowerCase())
    )
  );

  const isSelected = (value: string) => selected().includes(value);

  return (
    <div class="relative">
      <div class="dropdown dropdown-hover z-50">
        <label tabindex="0" class="m-0 p-0">
          <input
            tabindex="0"
            // class="btn m-1"
            type="text"
            placeholder={tCategory(selected() || placeholder)}
            onInput={(e) => setSearchTerm(e.currentTarget.value)}
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
                    setSelected(option.value);
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
