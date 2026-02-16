import { useRef } from "react";
import { SplitterCard, SplitterCardDivider } from "./SplitterCard";

export function SplitterPage({ items, groups }: SplitterPageProps) {
  const fullSplit = useRef([] as Split[]);
  return (
    <div>
      <div className=" p-1">
        {items.map((item, index) => (
          <>
            <SplitterCard
              item={item}
              groups={groups}
              adjustSplit={(s) => (fullSplit.current[index] = s)}
            />
            {index < items.length - 1 && <SplitterCardDivider />}
          </>
        ))}
      </div>
      <div className="p-1">
        <div className="p-2 bg-indigo-600 rounded-xl">
          <h3 className="pl-5 text-zinc-200 text-xl">Splits</h3>
          {fullSplit.current}
        </div>
      </div>
    </div>
  );
}

function processSplit(items: Item[], splits: Split[], groups: Group[]) {
  const debtsByPerson: { [person: string]: number } = {};

  for (const item of items) {
    for (const split of splits) 
  }
}

export type SplitterPageProps = {
  items: Item[];
  groups: Group[];
};
export type Item = {
  name: string;
  price: number;
};
export type Group = {
  name: string;
  symbol: string;
  members: string[];
  memberShares: number[];
};

export type Split = { shares: number; group: Group }[];
