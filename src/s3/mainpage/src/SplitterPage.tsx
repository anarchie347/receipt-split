export function SplitterPage({ items, groups }: SplitterPageProps) {
  return (
    <>
      <div
        className=" grid gap-2"
        style={{ gridTemplateColumns: `1fr ${" auto".repeat(groups.length)}` }}
      >
        {items.map((i) => (
          <>
            <div>E</div>
          </>
        ))}
      </div>
    </>
  );
}

export type SplitterPageProps = {
  items: string[];
  groups: Group[];
};

export type Group = { name: string; symbol: string; members: string[] };
