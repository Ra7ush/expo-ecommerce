import React from "react";
import { LoaderIcon } from "lucide-react";

function pageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="animate-spin h-10 w-10 text-blue-600" />
    </div>
  );
}

export default pageLoader;
