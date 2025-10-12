import { LoaderCircleIcon } from "lucide-react";

function Loading() {
  return (
    <div className="animate-pulse w-full items-center justify-center flex">
      <div className="animate-spin">
        <LoaderCircleIcon color="#00b8db" size={56} />
      </div>
    </div>
  );
}

export default Loading;
