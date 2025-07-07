import React, { useState, useEffect } from "react";
import { Category, Paper, PaperDownloadProgress } from "./types/papers";
import Header from "./components/Header";
import CategoryCard from "./components/CategoryCard";
import PaperList from "./components/PaperList";
import {
  downloadPapers,
  downloadSinglePaper,
  generatePaperUrl,
} from "./utils/download";
import categoriesData from "../papers.json";

function App() {
  const [categories] = useState<Category[]>(categoriesData.categories);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<
    Record<string, PaperDownloadProgress>
  >({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Generate papers array from categories
    const allPapers = categories.flatMap((category) => {
      const papers: Paper[] = [];
      for (let id = category.id_range[0]; id <= category.id_range[1]; id++) {
        papers.push({
          id: id.toString().padStart(3, "0"),
          title: `Paper ${id}`,
          url: generatePaperUrl(id),
          category: category.category,
        });
      }
      return papers;
    });
    setPapers(allPapers);
  }, [categories]);

  const handleDownloadCategory = async (category: Category) => {
    const categoryPapers = papers.filter(
      (paper) => paper.category === category.category
    );
    await downloadPapers(categoryPapers, (progress) => {
      setDownloadProgress((prev) => ({
        ...prev,
        [progress.paperId]: progress,
      }));
    });
  };

  const handleDownloadPaper = async (paper: Paper) => {
    try {
      setDownloadProgress((prev) => ({
        ...prev,
        [paper.id]: { paperId: paper.id, progress: 0, status: "downloading" },
      }));
      await downloadSinglePaper(paper);
      setDownloadProgress((prev) => ({
        ...prev,
        [paper.id]: { paperId: paper.id, progress: 1, status: "completed" },
      }));
    } catch (error) {
      setDownloadProgress((prev) => ({
        ...prev,
        [paper.id]: { paperId: paper.id, progress: 0, status: "error" },
      }));
    }
  };

  const handleDownloadAll = async () => {
    await downloadPapers(papers, (progress) => {
      setDownloadProgress((prev) => ({
        ...prev,
        [progress.paperId]: progress,
      }));
    });
  };

  const filteredPapers = papers.filter(
    (paper) =>
      paper.category === selectedCategory &&
      (paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.id.includes(searchTerm))
  );

  const activeDownloads = papers.filter(
    (paper) => downloadProgress[paper.id]?.status === "downloading"
  );

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(
      selectedCategory === category.category ? null : category.category
    );
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <main className="py-6">
          {/* Download All Button */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={handleDownloadAll}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Download All Papers
            </button>
          </div>

          {/* Categories Grid */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.category}
                  category={category}
                  onDownload={() => handleDownloadCategory(category)}
                  onClick={() => handleCategoryClick(category)}
                  isSelected={selectedCategory === category.category}
                  paperCount={category.id_range[1] - category.id_range[0] + 1}
                />
              ))}
            </div>
          </div>

          {/* Selected Category Papers */}
          {selectedCategory && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Papers in {selectedCategory}
                </h2>
                <input
                  type="text"
                  placeholder="Search papers in this category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-96 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <PaperList
                papers={filteredPapers}
                downloadProgress={downloadProgress}
                onDownload={handleDownloadPaper}
              />
            </div>
          )}

          {/* Active Downloads */}
          {activeDownloads.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Active Downloads ({activeDownloads.length})
                </h2>
                <PaperList
                  papers={activeDownloads}
                  downloadProgress={downloadProgress}
                  onDownload={handleDownloadPaper}
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
