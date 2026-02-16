import { useState } from "react";
import type { Group, Item } from "./SplitterPage";

export function SplitterRow({ item, groups }: SplitterRowProps) {
  return (
    <>
      <div className="flex items-center">
        <div className="flex-1 text-center text-zinc-200">{item.name}</div>
      </div>
      {groups.map((g) => (
        <SplitButton group={g} />
      ))}
    </>
  );
}

function SplitButton({ group }: SplitButtonProps) {
  const [localCount, setLocalCount] = useState(0);
  return (
    <>
      <div className="">
        <button
          className=" rounded-xl bg-violet-500 p-1 pl-2 pr-2"
          onClick={() => setLocalCount((x) => x + 1)}
        >
          {group.symbol}
          <sub>{localCount}</sub>
        </button>
      </div>
    </>
  );
}

export type SplitterRowProps = {
  item: Item;
  groups: Group[];
};

type SplitButtonProps = {
  group: Group;
};
