import { useState } from "react";
import type { Groups, ItemOnly, Shares } from "./SplitterPage";
import { objMap, objMapVals } from "./utils";

export function SplitterCard({
  itemOnly,
  groups,
  adjustShares,
}: SplitterRowProps) {
  const [localCounts, setLocalCounts] = useState<Shares>(
    objMap(groups, (gn, _) => [gn, 0]),
  );
  const incrAt = (groupName: string) => {
    const newShares: Shares = objMap(localCounts, (g, c) => [
      g,
      c + (g == groupName ? 1 : 0),
    ]);
    adjustShares(newShares);
    setLocalCounts(newShares);
  };
  return (
    <div className=" p-2 bg-zinc-700 rounded-xl">
      <div className="flex items-center">
        <div className="flex-1 text-left pl-5 text-zinc-200 text-xl">
          {itemOnly.name}
        </div>
        <div className="flex-1 text-right pr-5 text-zinc-200">
          £{itemOnly.price}
        </div>
      </div>
      <div className="flex gap-2 p-1 content-center align-middle justify-center">
        {Object.entries(groups).map(([gn, gd], i) => (
          <SplitButton
            symbol={gd.symbol}
            count={localCounts[i]}
            incrFunc={() => incrAt(gn)}
            key={i}
          />
        ))}
        <ZeroButton
          zeroFunc={() => setLocalCounts(objMapVals(localCounts, (_) => 0))}
        />
      </div>
    </div>
  );
}
export function SplitterCardDivider() {
  return <div className="p-2"></div>;
}

function SplitButton({ symbol, count, incrFunc }: SplitButtonProps) {
  return (
    <div className="">
      <button
        className=" rounded-xl bg-violet-500 p-1 pl-2 pr-2 text-zinc-200"
        onClick={incrFunc}
      >
        {symbol}
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
        ✘
      </button>
    </div>
  );
}

export type SplitterRowProps = {
  itemOnly: ItemOnly;
  groups: Groups;
  adjustShares: (s: Shares) => void;
};

type SplitButtonProps = {
  symbol: string;
  count: number;
  incrFunc: () => void;
};

type ZeroButtonProps = {
  zeroFunc: () => void;
};
