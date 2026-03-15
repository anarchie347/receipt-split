import { useRef } from "react";
import { SplitterCard, SplitterCardDivider } from "./SplitterCard";
import { objMap } from "./utils";

export function SplitterPage({ items, groups }: SplitterPageProps) {
  const mkEmptyShares: () => Shares = () => objMap(groups, (gn, _) => [gn, 0]);
  const itemsSplit = useRef<ItemSplit[]>(
    items.map((i) => ({ shares: mkEmptyShares(), ...i })),
  );

  return (
    <div>
      <div className=" p-1">
        {items.map((itemOnly, index) => (
          <>
            <SplitterCard
              itemOnly={itemOnly}
              groups={groups}
              adjustShares={(s) => (itemsSplit.current[index].shares = s)}
              key={index}
            />
            {index < items.length - 1 && <SplitterCardDivider />}
          </>
        ))}
      </div>
      <div className="p-1">
        <div className="p-2 bg-indigo-600 rounded-xl">
          <h3 className="pl-5 text-zinc-200 text-xl">Splits</h3>
          RESULT
        </div>
      </div>
    </div>
  );
}

function processSplit(items: ItemSplit[], groups: Groups) {
  const debtsByPerson: { [person: string]: number } = {};
  for (const item of items) {
  }
}

export type SplitterPageProps = {
  items: ItemOnly[];
  groups: Groups;
};

export type ItemOnly = {
  name: string;
  price: number;
};
export type ItemSplit = ItemOnly & { shares: Shares };

export type Groups = {
  [groupName: string]: GroupData;
};
export type GroupData = {
  symbol: string;
  memberShares: { [name: string]: number };
};

export type Shares = { [groupName: string]: number };
