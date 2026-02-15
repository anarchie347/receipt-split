import "./App.css";
import { SplitterPage, type Group } from "./SplitterPage";

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

const TEST_ITEMS: string[] = ["Yoghurt", "Eggs", "Milk"];
const TEST_GROUPS: Group[] = [
  { name: "Joe", symbol: "J", members: ["Joe"] },
  { name: "Pete", symbol: "P", members: ["Pete"] },
  { name: "Group", symbol: "G", members: ["Joe", "Pete"] },
];
