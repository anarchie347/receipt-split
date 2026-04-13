import { Users } from "lucide-react";
import { useEffect } from "react";
import type { Groups, Shares } from "./SplitterPage";

export function GroupSelector({ groups, setGroups }: GroupSelectorProps) {
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
          className=" text-zinc-200 text-center bg-indigo-800 rounded-2xl mx-auto px-5 my-1 py-0.5 flex opacity-90 bg-gradient-to-r from-indigo-600 to-indigo-800 transform transition duration-100 hover:scale-110 hover:shadow-2xl ease-out hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="text-left flex-1">
            {gn} ({gd.symbol}):{" "}
          </span>
          <span className=" text-righ flex-1">
            {formatSharesForDisplay(gd.memberShares)}
          </span>
        </div>
      ))}
    </div>
  );
}

export type GroupSelectorProps = {
  groups: Groups;
  setGroups: (grps: Groups) => void;
};
