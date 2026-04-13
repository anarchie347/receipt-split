import { CameraIcon, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { GroupSelector } from "./GroupSelector";
import type { Groups } from "./SplitterPage";

export function PhotoUploadPage({
  onSubmit,
  setGroups,
  groups,
}: PhotoUploadPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className=" h-full w-full flex flex-col items-center">
      <div className=" h-full flex flex-row items-center">
        {isLoading ? (
          <LoaderCircle
            color="#e4e4e7"
            className="animate-spin"
            size={32}
          /> /*zinc-200 */
        ) : (
          <div className=" flex gap-10">
            <div className="align-middle flex flex-column items-center">
              <div className="h-fit">
                <UploadBtn
                  onSubmit={onSubmit}
                  setLoading={() => setIsLoading(true)}
                  setFinishedLoading={() => setIsLoading(false)}
                />
              </div>
            </div>
            <div className="bg-zinc-600 w-0.5 rounded-2xl "></div>
            <GroupSelector groups={groups} setGroups={setGroups} />
          </div>
        )}
      </div>
    </div>
  );
}

function UploadBtn({
  onSubmit,
  setLoading,
  setFinishedLoading,
}: UploadBtnProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => inputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onloadend = async () => {
      const b64 = reader.result as string;
      setLoading();
      await onSubmit(b64);
      setFinishedLoading();
    };
    reader.readAsDataURL(file);
  };
  return (
    <>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleClick}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg bg-linear-to-r from-violet-500 to-violet-700 text-zinc-200 transform transition duration-100 hover:scale-110 hover:shadow-2xl ease-out hover:-translate-y-0.5 cursor-pointer"
        text-zinc-200
        rounded-2xl
        bg-zinc-700
      >
        <CameraIcon />
        Upload Photo
      </button>
    </>
  );
}

export type PhotoUploadPageProps = {
  onSubmit: (base64: string) => Promise<void>;
  setGroups: (grps: Groups) => void;
  groups: Groups;
};
type UploadBtnProps = {
  onSubmit: (base64: string) => Promise<void>;
  setLoading: () => void;
  setFinishedLoading: () => void;
};
