import { SplitterCard, SplitterCardDivider } from "./SplitterCard";

export function SplitterPage({ items, groups }: SplitterPageProps) {
  return (
    <>
      <div className=" bg-zinc-800 p-1">
        {items.map((i, index) => (
          <>
            <SplitterCard item={i} groups={groups} />
            {index < items.length - 1 && <SplitterCardDivider />}
          </>
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
