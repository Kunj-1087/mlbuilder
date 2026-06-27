interface FilterPillRowProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterPillRow({ filters, activeFilter, onFilterChange }: FilterPillRowProps) {
  return (
    <div className="flex flex-wrap gap-3 py-6">
      {filters.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`
              px-[18px] py-[10px]
              rounded-pill
              border-2 border-ink
              font-body text-[14px] font-semibold
              transition-all duration-150
              cursor-pointer select-none
              whitespace-nowrap
              ${isActive
                ? 'bg-accent text-ink shadow-hard'
                : 'bg-cream text-ink hover:bg-ink/5'
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
