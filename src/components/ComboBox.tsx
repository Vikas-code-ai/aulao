import { createSignal, createMemo, Accessor, For } from "solid-js";

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

export default function ComboBox({
  options,
  selected,
  setSelected,
  placeholder,
  ...props
}: Props) {
  const [dropdownVisible, setDropdownVisible] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal("");

  const filteredOptions = createMemo(() =>
    options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm().toLowerCase())
    )
  );

  return (
    <div class="combobox">
      <input
        type="text"
        placeholder={placeholder}
        value={options.find((o) => o.value == selected())?.label}
        onInput={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        onBlur={() => setDropdownVisible(false)}
      />
      {dropdownVisible() && (
        <div class="dropdown">
          <ul>
            <For each={filteredOptions()}>
              {(option) => (
                <li
                  // key={option.value}
                  onClick={() => {
                    setSelected(option.value);
                    setDropdownVisible(false);
                    setSearchTerm("");
                  }}
                >
                  {option.label}
                </li>
              )}
            </For>
          </ul>
        </div>
      )}
    </div>
  );
}
