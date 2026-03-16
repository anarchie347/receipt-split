import "./App.css";
import { SplitterPage, type Groups, type ItemOnly } from "./SplitterPage";

function App() {
  return (
    <>
      <div className="bg-zinc-800 h-full">
        <SplitterPage items={TEST_ITEMS} groups={TEST_GROUPS} />
      </div>
    </>
  );
}

export default App;

const TEST_ITEMS: ItemOnly[] = [
  { name: "Yoghurt", price: 1 },
  { name: "Eggs", price: 1.94 },
  { name: "Milk", price: 1.4 },
];
const TEST_GROUPS: Groups = {
  Joe: { symbol: "J", memberShares: { Joe: 1 } },
  Pete: { symbol: "Pe", memberShares: { Pete: 1 } },
  Phil: { symbol: "Ph", memberShares: { Phil: 1 } },
  Steve: { symbol: "S", memberShares: { Steve: 1 } },
  Group: { symbol: "G", memberShares: { Joe: 2, Pete: 1, Phil: 1, Steve: 1 } },
  Tobi: { symbol: "T", memberShares: { Tobi: 1 } },
  Bob: { symbol: "B", memberShares: { Bob: 1 } },
};

// j,n,a,g,m,e,b
