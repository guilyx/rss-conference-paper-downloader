import React from "react";
import { Category } from "../types/papers";

interface CategoryCardProps {
  category: Category;
  onDownload: () => void;
  onClick: () => void;
  isSelected: boolean;
  paperCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onDownload,
  onClick,
  isSelected,
  paperCount,
}) => {
  return (
    <div
      className={`p-6 rounded-lg border ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      } cursor-pointer transition-all hover:border-primary`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {category.category}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="px-4 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Download All
        </button>
      </div>
      <p className="text-gray-600 dark:text-gray-300">
        {paperCount} papers ({category.id_range[0]} - {category.id_range[1]})
      </p>
      {isSelected && (
        <p className="mt-2 text-sm text-primary">Click to hide papers list</p>
      )}
    </div>
  );
};

export default CategoryCard;
