'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  return (
    <div className="search-bar">
      <Image src="/icons/search.svg" alt="Search" width={20} height={20} />
      <input
        type="text"
        placeholder="Search events by title, tags, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="clear-btn"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
