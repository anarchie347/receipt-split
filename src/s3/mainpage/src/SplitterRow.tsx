import type { Group } from "./SplitterPage";

export function SplitterRow({ item, groups }: SplitterRowProps) {
  return (
    <div className=" flex w-full border-amber-950 border-2">
      <div className=" flex-1 border-cyan-100 border-2 items-center flex text-center">
        <div className="flex-1">{item}</div>
      </div>
      <div className="flex-">
        {groups.map((g) => (
          <SplitButton group={g} />
        ))}
      </div>
    </div>
  );
}

function SplitButton({ group }: SplitButtonProps) {
  return (
    <>
      <div className="p-1 border-amber-100 border-2 text-xl">
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
