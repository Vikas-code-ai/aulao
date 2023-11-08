import {
  createSignal,
  createMemo,
  For,
  Accessor,
  onCleanup,
  createEffect,
} from "solid-js";
import { check, xCircle } from "solid-heroicons/solid";
import { Icon } from "solid-heroicons";
import { Option } from "../types";
interface Props {
  options: Option[];
  selected: Accessor<string | undefined>;
  setSelected: (options: string | undefined) => void;
  placeholder: string;
}

export function ComboBox({
  options,
  selected,
  setSelected,
  placeholder,
  ...props
}: Props) {
  let inputRef;
  const [searchTerm, setSearchTerm] = createSignal("");

  const [dropdownVisible, setDropdownVisible] = createSignal(false);
  const [dropdownHovered, setDropdownHovered] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(-1);

  const [filteredOptions, setFilteredOptions] = createSignal<Option[]>(options);

  createEffect(() =>
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm().toLowerCase())
      )
    )
  );

  // const filteredOptions = createMemo(() =>
  //   options.filter((option) =>
  //     option.label.toLowerCase().includes(searchTerm().toLowerCase())
  //   )
  // );

  const isSelected: (value?: string) => boolean = (value) =>
    !!value && (selected()?.includes(value) || false);

  const handleKeyDown = (e: any) => {
    if (dropdownVisible() == false) setDropdownVisible(true);
    if (
      e.key === "ArrowDown" &&
      selectedIndex() < filteredOptions().length - 1
    ) {
      e.preventDefault();
      setSelectedIndex(selectedIndex() + 1);
    } else if (e.key === "ArrowUp" && selectedIndex() > 0) {
      e.preventDefault();
      setSelectedIndex(selectedIndex() - 1);
    } else if (e.key === "Enter" && selectedIndex() >= 0) {
      setSelected(filteredOptions()[selectedIndex()].label);
      setDropdownVisible(false);
    }
  };

  onCleanup(() => {
    setSelectedIndex(-1); // Reset the selected index when component unmounts
  });

  return (
    <div class="relative">
      <div
        class="dropdown z-50"
        onMouseEnter={() => {
          // Mouse is over the dropdown elements, prevent blurring
          setDropdownHovered(true);
        }}
        onMouseLeave={() => {
          // Mouse is not over the dropdown elements, allow blurring
          setDropdownHovered(false);
        }}
      >
        <div class="flex flex-row gap-2 px-1">
          <label tabindex="0" class="m-0 p-0">
            <input
              ref={inputRef}
              tabindex="0"
              type="text"
              placeholder={options.find((o) => o.id == selected())?.label}
              onInput={(e) => setSearchTerm(e.currentTarget.value)}
              onClick={(e) => {
                // Clear the search term when the input is clicked
                setSearchTerm("");
                e.currentTarget.value = "";
              }}
              onFocus={() => {
                setDropdownVisible(true);

                // Focus on the dropdown element
                // const dropdownElement = document.querySelector(
                //   ".dropdown"
                // ) as HTMLElement;

                // console.log("dropdown", dropdownElement);
                // if (dropdownElement) {
                //   dropdownElement.focus();
                // }
              }}
              onBlur={() => {
                console.log(".... dropdown close onlblur");
                // setDropdownVisible(false);
                if (!dropdownHovered()) {
                  setDropdownVisible(false);
                }
              }}
              onKeyDown={handleKeyDown}
            />
          </label>
          {selected() ? (
            <button onClick={() => setSelected(undefined)}>
              <Icon path={xCircle} class="w-6 h-6 text-secondary" />
            </button>
          ) : (
            <span class="w-6 h-6"></span>
          )}
        </div>
        <ul
          tabindex="0"
          class="menu bg-base-200 w-56 rounded-box"
          // class="menu bg-base-200 w-56 p-0 [&_li>*]:rounded-none"
          style={{ display: dropdownVisible() ? "block" : "none" }}
        >
          <For each={filteredOptions()}>
            {(option, index) => {
              const isHovered = createMemo(() => index() === selectedIndex());
              return (
                <li
                  // class={
                  //   // "flex flex-row  pl-0 ml-0 " +
                  //   // (isHovered() ? "bg-red-300" : "") +
                  //   isSelected(option.value)
                  //     ? " bg-slate-400 text-white rounded-md "
                  //     : ""
                  // }
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(option.id);
                    setDropdownVisible(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setSelected(option.id);
                      setDropdownVisible(false);
                    }
                  }}
                  tabIndex={0}
                  role="option"
                  aria-selected={isSelected(option.id)}
                  aria-setsize={filteredOptions().length}
                  aria-posinset={index() + 1}
                >
                  <div
                    class={
                      // "flex flex-row  pl-0 ml-0 " +
                      // (isHovered() ? "bg-red-300" : "") +
                      isSelected(option.id)
                        ? " bg-primary text-white rounded-md "
                        : ""
                    }
                  >
                    {isSelected(option.id) ? (
                      <Icon path={check} class="w-4 h-4 text-white-400" />
                    ) : (
                      <span class="pl-4" />
                    )}
                    <span class="">{option.label}</span>
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
