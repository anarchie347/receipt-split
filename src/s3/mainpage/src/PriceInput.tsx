import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

export function PriceInput({ initialPrice, setPrice }: PriceInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [display, setDisplay] = useState(initialPrice.toFixed(2));
  const oldVal = useRef(initialPrice.toFixed(2));

  const handleFocus = () => {
    setIsEditing(true);
    oldVal.current = display;
  };
  const handleBlur = () => {
    setIsEditing(false);
    const parsed = parseFloat(display);
    if (isNaN(parsed)) {
      setDisplay(oldVal.current);
      return;
    }
    setDisplay(parsed.toFixed(2));
    setPrice(parsed);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newAsStr = e.target.value;
    const isNegative = newAsStr.startsWith("-");
    newAsStr = newAsStr.replace("-", "");
    newAsStr = newAsStr.replace(/[^0-9.]/g, "");
    if (isNegative) newAsStr = "-" + newAsStr;

    const parts = newAsStr.split(".");
    const afterDecimal = parts[1]?.slice(0, 2);
    if (afterDecimal) newAsStr = parts[0] + "." + afterDecimal;

    setDisplay(newAsStr);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter" || e.key == "Escape") {
      (document.activeElement as HTMLElement)?.blur();
      return;
    }
    const allowed = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
      "Enter",
    ];
    if (allowed.includes(e.key) || (e.key >= "0" && e.key <= "9")) return;
    if (
      (e.key == "." && !display.includes(".")) ||
      (e.key == "-" && !display.includes("-"))
    )
      return;
    e.preventDefault();
  };

  return (
    <input
      className={` font-[inherit] text-right w-1/2 m-0 p-0 ${isEditing ? "bg-indigo-800" : "bg-transparent"}`}
      type="text"
      inputMode="numeric"
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={handleChange}
      value={isEditing ? display : addCurrencySymbol(display)}
    />
  );
}

function addCurrencySymbol(display: string) {
  if (display.startsWith("-")) {
    return "-£" + display.slice(1);
  }
  return "£" + display;
}

export type PriceInputProps = {
  initialPrice: number;
  setPrice: (p: number) => void;
};
