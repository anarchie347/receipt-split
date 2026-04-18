import { Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { GroupData, Groups, Shares } from "./SplitterPage";

export function GroupSelector({ groups, setGroups }: GroupSelectorProps) {
  const addGrpRef = useRef<HTMLInputElement>(null);
  const [copyBtnText, setCopyBtnText] = useState("Copy Config");

  useEffect(() => {
    const queryStr = window.location.search;
    const params = new URLSearchParams(queryStr);
    const groupsStr = params.get("groups");
    if (!groupsStr) {
      setGroups({});
      return;
    }
    const groupsObj = JSON.parse(groupsStr);
    fixSymbols(groupsObj);
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
      const [grpNameUntrimmed, ...rest] = input.split(":");
      const grpName = grpNameUntrimmed.trim();
      const membersStr = rest.join(":");
      const membersArr = membersStr.split(",");
      const memberShares = Object.fromEntries(
        membersArr.map((x) => [
          x.split(":")[0].trim(),
          Number.parseInt(x.split(":")[1] ?? 1),
        ]),
      );
      const grpData: GroupData = {
        symbol: "placeholder",
        memberShares,
      };
      const newGroups = { ...groups };
      newGroups[grpName] = grpData;
      fixSymbols(newGroups);
      setGroups(newGroups);
      addGrpRef.current.value = "";
    } catch {
      alert("Error parsing string");
    }
  };

  const handleCopyConfig = () => {
    const config = JSON.stringify(groups);
    const url = new URL(window.location.href);
    url.searchParams.set("groups", config);
    const newUrl = url.toString();
    navigator.clipboard.writeText(newUrl);
    setCopyBtnText("Copied!");
    setTimeout(() => setCopyBtnText("Copy Config"), 1200);
  };

  const removeGroup = (gn: string) => {
    const newGroups = { ...groups };
    delete newGroups[gn];
    setGroups(newGroups);
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
          onClick={() => removeGroup(gn)}
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
      <button
        className="text-zinc-200 text-center bg-indigo-800 rounded-2xl mx-auto px-5 my-1 py-0.5 flex opacity-90 bg-linear-to-r from-indigo-600 to-indigo-800 transform transition duration-100 hover:scale-110 hover:shadow-2xl ease-out hover:-translate-y-0.5 cursor-pointer"
        onClick={handleCopyConfig}
      >
        {copyBtnText}
      </button>
      <div className=" text-zinc-200 opacity-50 text-center">
        Click a group to remove
        <br></br>
        To edit groups, add one with the same name
        <br></br>
        Format then example:
        <br></br>
        group: member1:shares1, member2:shares2
        <br></br>
        All: Joe:1,Pete:2
        <br></br>
        To add a new person, just enter the name
      </div>
    </div>
  );
}

function fixSymbols(grps: Groups) {
  // make all symbols unique
  const names = Object.keys(grps);
  const nameSymbolMap: { [name: string]: string } = {};

  // not very efficient
  // This is fine as the number of groups will be small
  for (const n of names) {
    let foundKey = false;
    for (let i = 1; i < n.length; i++) {
      let countMatched = 0;
      const possKey = n.substring(0, i);

      for (const m of names) {
        if (m.startsWith(possKey)) countMatched++;
      }

      if (countMatched === 1) {
        nameSymbolMap[n] = possKey;
        foundKey = true;
        break;
      }
    }

    if (!foundKey) nameSymbolMap[n] = n; // This name is a substring of another group name, so the symbol must be the whole name
  }
  Object.entries(nameSymbolMap).forEach(
    ([name, sym]) => (grps[name].symbol = sym),
  );
}

export type GroupSelectorProps = {
  groups: Groups;
  setGroups: (grps: Groups) => void;
};
