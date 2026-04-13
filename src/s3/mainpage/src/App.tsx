import { useEffect, useRef, useState } from "react";
import "./App.css";
import { PhotoUploadPage } from "./PhotoUploadPage";
import { SplitterPage, type Groups, type ItemOnly } from "./SplitterPage";

function App() {
  useEffect(() => {
    fetch("/api/wake"); // warm up the lambda backend
  }, []);

  const [page, setPage] = useState<Page>("PhotoUpload");
  const itemsRef = useRef<ItemOnly[]>([]);
  return (
    <>
      <div className="bg-zinc-800 h-screen w-screen">
        {page == "PhotoUpload" ? (
          <PhotoUploadPage
            onSubmit={async (b64) => {
              const resp = await fetch("/api/process", {
                method: "POST",
                body: b64,
              });
              console.log("Resp received");
              console.log(resp);
              itemsRef.current = await resp.json();
              setPage("Split");
            }}
          />
        ) : (
          <SplitterPage items={itemsRef.current} groups={TEST_GROUPS} />
        )}
      </div>
    </>
  );
}

export default App;

type Page = "PhotoUpload" | "Split";

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
