import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';
import { useLocale } from '../contexts/LocaleContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const { t } = useLocale();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto my-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t('searchPlaceholder')}
          className="w-full p-4 pl-12 text-lg border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-primary-light focus:border-transparent transition"
        />
        <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-dark transition-colors">
          <SearchIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;