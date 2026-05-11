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
  const [groups, setGroups] = useState<Groups>({});
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
              if (!resp.ok) {
                alert(
                  `Sorry there was an error, please try again.\nIf this error persists, please report.\nError: ${resp.status}`,
                );
                return;
              }
              const data = await resp.json();
              if (data.unsure) {
                alert(
                  "Could not read prices properly. Sum of item prices did not match stated total.\nPlease double check prices and adjust if needed",
                );
              }
              itemsRef.current = data.items;
              setPage("Split");
            }}
            groups={groups}
            setGroups={setGroups}
          />
        ) : (
          <SplitterPage items={itemsRef.current} groups={groups} />
        )}
      </div>
    </>
  );
}

export default App;

type Page = "PhotoUpload" | "Split";
