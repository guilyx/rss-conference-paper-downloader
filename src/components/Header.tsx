import React from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              RSS 2025 Papers
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Download conference papers individually or in bulk
            </p>
          </div>
          <DocumentArrowDownIcon className="h-8 w-8 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default Header;
