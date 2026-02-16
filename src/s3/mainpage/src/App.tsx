import "./App.css";
import { SplitterPage, type Group, type Item } from "./SplitterPage";

function App() {
  return (
    <>
      <SplitterPage items={TEST_ITEMS} groups={TEST_GROUPS} />
    </>
  );
  // return (
  //   <>
  //     <p>Hello world</p>
  //     <input
  //       type="file"
  //       accept="image/*"
  //       capture="environment"
  //       onChange={(e) => {
  //         const f = e.target.files![0];
  //         console.log(f);
  //       }}
  //     />
  //   </>
  // );
}

export default App;

const TEST_ITEMS: Item[] = [
  { name: "Yoghurt", price: 1 },
  { name: "Eggs", price: 1.94 },
  { name: "Milk", price: 1.4 },
];
const TEST_GROUPS: Group[] = [
  { name: "Joe", symbol: "J", members: ["Joe"] },
  { name: "Pete", symbol: "P", members: ["Pete"] },
  { name: "Group", symbol: "G", members: ["Joe", "Pete"] },
  { name: "Joe", symbol: "J", members: ["Joe"] },
  { name: "Pete", symbol: "P", members: ["Pete"] },
  { name: "Group", symbol: "G", members: ["Joe", "Pete"] },
  { name: "Joe", symbol: "J", members: ["Joe"] },
];

// j,n,a,g,m,e,b
