import { Users } from "lucide-react";
import { useEffect, useRef } from "react";
import type { GroupData, Groups, Shares } from "./SplitterPage";

export function GroupSelector({ groups, setGroups }: GroupSelectorProps) {
  const addGrpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const queryStr = window.location.search;
    const params = new URLSearchParams(queryStr);
    const groupsStr = params.get("groups");
    if (!groupsStr) {
      setGroups({});
      return;
    }
    const groupsObj = JSON.parse(groupsStr);
    setGroups(groupsObj);
  }, []);

  const formatSharesForDisplay = (shares: Shares) =>
    Object.keys(shares).length == 1
      ? ""
      : Object.entries(shares)
          .map(([mn, c]) => `${mn}:${c}`)
          .join(", ");

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!addGrpRef.current) return;
    const input = addGrpRef.current.value;
    try {
      const [grpName, ...rest] = input.split(":");
      const membersStr = rest.join(":");
      const membersArr = membersStr.split(",");
      const memberShares = Object.fromEntries(
        membersArr.map((x) => [
          x.split(":")[0],
          Number.parseInt(x.split(":")[1]),
        ]),
      );
      const grpData: GroupData = {
        symbol: "LOREM",
        memberShares,
      };
      const newGroups = { ...groups };
      newGroups[grpName] = grpData;
      setGroups(newGroups);
      addGrpRef.current.value = "";
    } catch (err) {
      alert(err);
    }
  };

  if (!groups) return <></>;

  return (
    <div className="">
      <div className="text-center flex items-center pb-6">
        <Users className="text-zinc-200 flex-1 " size={64} />
        <span className=" text-left text-zinc-200 text-2xl flex-1">Groups</span>
      </div>
      {Object.entries(groups).map(([gn, gd], i) => (
        <div
          key={i}
          className=" text-zinc-200 text-center bg-indigo-800 rounded-2xl mx-auto px-5 my-1 py-0.5 flex opacity-90 bg-linear-to-r from-indigo-600 to-indigo-800 transform transition duration-100 hover:scale-110 hover:shadow-2xl ease-out hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="text-left flex-1">
            {gn} ({gd.symbol}):{" "}
          </span>
          <span className=" text-righ flex-1">
            {formatSharesForDisplay(gd.memberShares)}
          </span>
        </div>
      ))}
      <div className=" text-zinc-200 text-center bg-indigo-800 rounded-2xl mx-auto px-5 my-1 py-0.5 flex opacity-90 bg-linear-to-r from-indigo-600 to-indigo-800 transform transition duration-100 hover:scale-110 hover:shadow-2xl ease-out hover:-translate-y-0.5 cursor-pointer">
        <input
          className=" text-shadow-zinc-200 outline-0"
          placeholder="Add..."
          type="text"
          onKeyUp={handleKeyUp}
          ref={addGrpRef}
        />
      </div>
    </div>
  );
}

export type GroupSelectorProps = {
  groups: Groups;
  setGroups: (grps: Groups) => void;
};
