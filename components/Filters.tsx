'use client';

interface FiltersProps {
  date: string;
  mode: string;
  onDateChange: (date: string) => void;
  onModeChange: (mode: string) => void;
  onClearFilters: () => void;
}

export default function Filters({ date, mode, onDateChange, onModeChange, onClearFilters }: FiltersProps) {
  const hasActiveFilters = date || mode;

  return (
    <div className="filters">
      <div className="filters-group">
        <div className="filter-item">
          <label htmlFor="date-filter">Date</label>
          <input
            id="date-filter"
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-item">
          <label htmlFor="mode-filter">Mode</label>
          <select
            id="mode-filter"
            value={mode}
            onChange={(e) => onModeChange(e.target.value)}
            className="filter-select"
          >
            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={onClearFilters} className="btn-clear-filters">
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
