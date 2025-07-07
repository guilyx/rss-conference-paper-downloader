import React from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Paper, PaperDownloadProgress } from "../types/papers";

interface PaperListProps {
  papers: Paper[];
  downloadProgress: Record<string, PaperDownloadProgress>;
  onDownload: (paper: Paper) => void;
}

const PaperList: React.FC<PaperListProps> = ({
  papers,
  downloadProgress,
  onDownload,
}) => {
  return (
    <div className="grid gap-4">
      {papers.map((paper) => {
        const progress = downloadProgress[paper.id];
        const isDownloading = progress?.status === "downloading";
        const isCompleted = progress?.status === "completed";
        const hasError = progress?.status === "error";

        return (
          <div
            key={paper.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between"
          >
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {paper.title || `Paper ${paper.id}`}
              </h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Category: {paper.category}
              </p>
            </div>
            <div className="ml-4 flex items-center">
              {isDownloading && (
                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress.progress * 100}%` }}
                  />
                </div>
              )}
              <button
                onClick={() => onDownload(paper)}
                disabled={isDownloading}
                className={`ml-4 p-2 rounded-full transition-colors ${
                  isCompleted
                    ? "bg-green-100 text-green-600"
                    : hasError
                    ? "bg-red-100 text-red-600"
                    : "bg-primary/10 text-primary hover:bg-primary/20"
                }`}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaperList;
