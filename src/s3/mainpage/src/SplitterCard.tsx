import { useState } from "react";
import type { Group, Item, Split } from "./SplitterPage";

export function SplitterCard({ item, groups, adjustSplit }: SplitterRowProps) {
  const [localCounts, setLocalCounts] = useState(groups.map((_) => 0));
  const incrAt = (index: number) => {
    const split: Split = groups.map((g, i) => ({
      shares: localCounts[i] + (i === index ? 1 : 0),
      group: g,
    }));
    setLocalCounts((old) => old.map((ov, oi) => (oi === index ? ov + 1 : ov)));
    adjustSplit(split);
  };
  return (
    <div className=" p-2 bg-zinc-700 rounded-xl">
      <div className="flex items-center">
        <div className="flex-1 text-left pl-5 text-zinc-200 text-xl">
          {item.name}
        </div>
        <div className="flex-1 text-right pr-5 text-zinc-200">
          £{item.price}
        </div>
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
        ✘<sub></sub>
      </button>
    </div>
  );
}

export type SplitterRowProps = {
  item: Item;
  groups: Group[];
  adjustSplit: (s: Split) => void;
};

type SplitButtonProps = {
  group: Group;
  count: number;
  incrFunc: () => void;
};

type ZeroButtonProps = {
  zeroFunc: () => void;
};
