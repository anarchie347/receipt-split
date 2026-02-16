import { useState } from "react";
import type { Group, Item } from "./SplitterPage";

export function SplitterCard({ item, groups }: SplitterRowProps) {
  const [localCounts, setLocalCounts] = useState(groups.map((_) => 0));
  const incrAt = (i: number) =>
    setLocalCounts((old) => old.map((ov, oi) => (oi === i ? ov + 1 : ov)));
  return (
    <div className=" p-2 bg-zinc-700 rounded-xl">
      <div className="flex items-center">
        <div className="flex-1 text-center text-zinc-200">{item.name}</div>
      </div>
      <div className="flex gap-2 p-1 content-center align-middle justify-center">
        {groups.map((g, i) => (
          <SplitButton
            group={g}
            count={localCounts[i]}
            incrFunc={() => incrAt(i)}
          />
        ))}
        <ZeroButton zeroFunc={() => setLocalCounts(groups.map((_) => 0))} />
      </div>
    </div>
  );
}
export function SplitterCardDivider() {
  return <div className="p-2"></div>;
}

function SplitButton({ group, count, incrFunc }: SplitButtonProps) {
  return (
    <div className="">
      <button
        className=" rounded-xl bg-violet-500 p-1 pl-2 pr-2 text-zinc-200"
        onClick={incrFunc}
      >
        {group.symbol}
        <sub>{count}</sub>
      </button>
    </div>
  );
}

function ZeroButton({ zeroFunc }: ZeroButtonProps) {
  return (
    <div className="">
      <button
        className=" rounded-xl bg-red-500 p-1 pl-2 pr-2 text-zinc-100"
        onClick={zeroFunc}
      >
        X<sub></sub>
      </button>
    </div>
  );
}

export type SplitterRowProps = {
  item: Item;
  groups: Group[];
};

type SplitButtonProps = {
  group: Group;
  count: number;
  incrFunc: () => void;
};

type ZeroButtonProps = {
  zeroFunc: () => void;
};
