import {
  createSignal,
  createMemo,
  For,
  Accessor,
  onCleanup,
  createEffect,
  Show,
} from "solid-js";
import { check, xCircle } from "solid-heroicons/solid";
import { Icon } from "solid-heroicons";
import { Option } from "../types";
import { tCategory } from "~/i18n/dict";

interface SingleSelectProps {
  options: Option[];
  selected: Accessor<string | undefined>;
  setSelected: (value: string | undefined) => void;
  placeholder: string;
  multiple?: false;
  useTranslation?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  selected: Accessor<string[]>;
  setSelected: (value: string[]) => void;
  placeholder: string;
  multiple: true;
  useTranslation?: boolean;
}

type Props = SingleSelectProps | MultiSelectProps;

export function ComboBox(props: Props) {
  let inputRef: HTMLInputElement | undefined;
  const [searchTerm, setSearchTerm] = createSignal("");
  const [dropdownVisible, setDropdownVisible] = createSignal(false);
  const [dropdownHovered, setDropdownHovered] = createSignal(false);
  const [selectedIndex, setSelectedIndex] = createSignal(-1);

  const filteredOptions = createMemo(() =>
    props.options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm().toLowerCase())
    )
  );

  const isSelected = (value: string): boolean => {
    if (props.multiple) {
      return props.selected().includes(value);
    } else {
      return props.selected() === value;
    }
  };

  const handleSelect = (value: string) => {
    if (props.multiple) {
      const currentSelected = props.selected();
      if (currentSelected.includes(value)) {
        props.setSelected(currentSelected.filter((v) => v !== value));
      } else {
        props.setSelected([...currentSelected, value]);
      }
      setSearchTerm("");
    } else {
      props.setSelected(value);
      setDropdownVisible(false);
      setSearchTerm("");
    }
  };

  const handleRemove = (value: string) => {
    if (props.multiple) {
      props.setSelected(props.selected().filter((v) => v !== value));
    } else {
      props.setSelected(undefined);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!dropdownVisible()) setDropdownVisible(true);

    if (e.key === "ArrowDown" && selectedIndex() < filteredOptions().length - 1) {
      e.preventDefault();
      setSelectedIndex(selectedIndex() + 1);
    } else if (e.key === "ArrowUp" && selectedIndex() > 0) {
      e.preventDefault();
      setSelectedIndex(selectedIndex() - 1);
    } else if (e.key === "Enter" && selectedIndex() >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions()[selectedIndex()].id);
    } else if (e.key === "Escape") {
      setDropdownVisible(false);
      inputRef?.blur();
    }
  };

  const getDisplayValue = (): string => {
    if (props.multiple) {
      return "";
    }
    const selectedValue = props.selected();
    if (!selectedValue) return "";
    const option = props.options.find((o) => o.id === selectedValue);
    if (!option) return "";
    return props.useTranslation ? tCategory(option.label) : option.label;
  };

  const getOptionLabel = (option: Option): string => {
    return props.useTranslation ? tCategory(option.label) : option.label;
  };

  onCleanup(() => {
    setSelectedIndex(-1);
  });

  return (
    <div class="relative">
      <Show when={props.multiple && props.selected().length > 0}>
        <div class="flex flex-wrap gap-1 mx-1 mb-2">
          <For each={props.selected()}>
            {(selectedId) => {
              const option = props.options.find((o) => o.id === selectedId);
              return (
                <span class="flex flex-row gap-1 px-1 rounded-lg bg-primary">
                  <a
                    class="text-white font-semibold decoration-white no-underline"
                    href={`#${selectedId}`}
                  >
                    {option ? getOptionLabel(option) : selectedId}
                  </a>
                  <button onClick={() => handleRemove(selectedId)}>
                    <Icon path={xCircle} class="w-4 h-4 text-white" />
                  </button>
                </span>
              );
            }}
          </For>
        </div>
      </Show>

      <div
        class="dropdown z-50"
        onMouseEnter={() => setDropdownHovered(true)}
        onMouseLeave={() => setDropdownHovered(false)}
      >
        <div class="flex flex-row gap-2 px-1">
          <label tabindex="0" class="m-0 p-0 flex-1">
            <input
              ref={inputRef}
              tabindex="0"
              type="text"
              placeholder={getDisplayValue() || props.placeholder}
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.currentTarget.value)}
              onClick={(e) => {
                setSearchTerm("");
                e.currentTarget.value = "";
              }}
              onFocus={() => setDropdownVisible(true)}
              onBlur={() => {
                if (!dropdownHovered()) {
                  setDropdownVisible(false);
                }
              }}
              onKeyDown={handleKeyDown}
            />
          </label>
          <Show when={!props.multiple && props.selected()}>
            <button onClick={() => handleRemove("")}>
              <Icon path={xCircle} class="w-6 h-6 text-secondary" />
            </button>
          </Show>
          <Show when={!props.multiple && !props.selected()}>
            <span class="w-6 h-6"></span>
          </Show>
        </div>

        <Show when={dropdownVisible()}>
          <ul
            tabindex="0"
            class="menu bg-base-200 w-56 rounded-box"
            style={{ display: "block" }}
          >
            <For each={filteredOptions()}>
              {(option, index) => {
                const isHovered = createMemo(() => index() === selectedIndex());
                return (
                  <li
                    onMouseEnter={() => setSelectedIndex(index())}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSelect(option.id);
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
                        isSelected(option.id)
                          ? "bg-primary text-white rounded-md"
                          : ""
                      }
                    >
                      {isSelected(option.id) ? (
                        <Icon path={check} class="w-4 h-4 text-white" />
                      ) : (
                        <span class="pl-4" />
                      )}
                      <span class="">{getOptionLabel(option)}</span>
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </Show>
      </div>
    </div>
  );
}
