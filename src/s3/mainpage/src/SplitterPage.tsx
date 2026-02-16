import { SplitterRow } from "./SplitterRow";

export function SplitterPage({ items, groups }: SplitterPageProps) {
  return (
    <>
      <div
        className=" grid gap-2 bg-zinc-800 "
        style={{ gridTemplateColumns: `1fr ${" auto".repeat(groups.length)}` }}
      >
        {items.map((i) => (
          <SplitterRow item={i} groups={groups} />
        ))}
      </div>
    </>
  );
}

export type SplitterPageProps = {
  items: Item[];
  groups: Group[];
};
export type Item = {
  name: string;
  price: number;
};
export type Group = { name: string; symbol: string; members: string[] };
