"use client";

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const categories = [
  { name: "전체", value: "all" },
  { name: "가챠샵", value: "가챠샵" },
  { name: "굿즈샵", value: "굿즈샵" },
  { name: "피규어샵", value: "피규어샵" },
  { name: "애니메이션 카페", value: "애니메이션 카페" },
  { name: "코스프레 의상점", value: "코스프레 의상점" },
  { name: "만화책방", value: "만화책방" },
  { name: "성지순례지", value: "성지순례지" },
];

const CategoryFilter = ({
  selectedCategories,
  onCategoryChange,
}: CategoryFilterProps) => {
  const handleCategoryClick = (value: string) => {
    if (value === "all") {
      onCategoryChange([]);
    } else {
      if (selectedCategories.includes(value)) {
        // 이미 선택된 경우 제거
        onCategoryChange(selectedCategories.filter((cat) => cat !== value));
      } else {
        // 선택 추가
        onCategoryChange([...selectedCategories, value]);
      }
    }
  };

  const isSelected = (value: string) => {
    if (value === "all") {
      return selectedCategories.length === 0;
    }
    return selectedCategories.includes(value);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => handleCategoryClick(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              isSelected(category.value)
                ? "bg-primary text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-primary hover:text-primary"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
