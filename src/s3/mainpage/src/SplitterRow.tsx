import type { Group } from "./SplitterPage";

export function SplitterRow({ item, groups }: SplitterRowProps) {
  return (
    <>
      <div className="flex items-center">
        <div className="flex-1 text-center text-zinc-200">{item}</div>
      </div>
      {groups.map((g) => (
        <SplitButton group={g} />
      ))}
    </>
  );
}

function SplitButton({ group }: SplitButtonProps) {
  return (
    <>
      <div className="text-xl">
        <button className=" rounded-xl bg-amber-300 p-1 pl-2 pr-2">
          {group.symbol}
        </button>
      </div>
    </>
  );
}

export type SplitterRowProps = {
  item: string;
  groups: Group[];
};

type SplitButtonProps = {
  group: Group;
};
