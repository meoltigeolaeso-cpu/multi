

import React, { useState, useEffect } from 'react';
import FilterIcon from './icons/FilterIcon';
import { useLocale } from '../contexts/LocaleContext';

interface FilterControlsProps {
  onFilterChange: (filters: any) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange }) => {
  const { t } = useLocale();
  const [isDetailFilterOpen, setIsDetailFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    view: 'listings',
    category: 'all',
    date: '',
    price: 500000,
    sort: 'popular'
  });
  
  // Pass changes up to parent whenever filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    const defaultFilters = { ...filters, date: '', price: 500000, sort: 'popular' };
    setFilters(defaultFilters);
    setIsDetailFilterOpen(false);
  };
  
  return (
    <div className="my-4 bg-white rounded-xl shadow p-4">
      {/* Primary Category Tabs */}
      <div className="flex space-x-2 border-b pb-3">
        {['all', 'accommodation', 'golf'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilters(f => ({...f, category: cat}))} 
            className={`px-4 py-2 text-sm sm:text-base rounded-lg font-semibold transition-colors ${filters.category === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {t(cat)}
          </button>
        ))}
      </div>
      
      {/* Secondary ViewMode Tabs */}
      <div className="flex mt-3">
        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button 
            onClick={() => setFilters(f => ({...f, view: 'listings'}))}
            className={`px-4 py-1.5 text-sm sm:text-base rounded-md font-semibold transition-all ${filters.view === 'listings' ? 'bg-white text-primary shadow' : 'text-gray-600'}`}
          >
            {t('tabListings')}
          </button>
          <button 
            onClick={() => setFilters(f => ({...f, view: 'wanteds'}))}
            className={`px-4 py-1.5 text-sm sm:text-base rounded-md font-semibold transition-all ${filters.view === 'wanteds' ? 'bg-white text-secondary shadow' : 'text-gray-600'}`}
          >
            {t('tabWanteds')}
          </button>
        </div>
        
        <div className="ml-auto relative">
           <button 
            onClick={() => setIsDetailFilterOpen(!isDetailFilterOpen)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <FilterIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">{t('filters')}</span>
          </button>

          {isDetailFilterOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white p-6 rounded-lg shadow-xl z-10 animate-fade-in-up border">
              <h3 className="text-lg font-bold mb-4">{t('detailedFilters')}</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="date" className="font-semibold text-sm text-gray-600">{t('date')}</label>
                  <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="w-full mt-1 p-2 border rounded-md" />
                </div>
                <div>
                  <label htmlFor="price" className="font-semibold text-sm text-gray-600">{t('maxPrice')}: {Number(filters.price).toLocaleString()}{t('currencyWon')}</label>
                  <input type="range" name="price" min="0" max="1000000" step="10000" value={filters.price} onChange={handleFilterChange} className="w-full mt-1 accent-primary" />
                </div>
                 <div>
                  <label htmlFor="sort" className="font-semibold text-sm text-gray-600">{t('sort')}</label>
                  <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full mt-1 p-2 border rounded-md bg-white">
                    <option value="popular">{t('sortPopular')}</option>
                    <option value="price_asc">{t('sortPriceAsc')}</option>
                    <option value="price_desc">{t('sortPriceDesc')}</option>
                    <option value="date_asc">{t('sortDateAsc')}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={handleResetFilters} className="px-4 py-2 text-sm bg-gray-200 rounded-md font-semibold">{t('reset')}</button>
                <button onClick={() => setIsDetailFilterOpen(false)} className="px-4 py-2 text-sm bg-primary text-white rounded-md font-semibold">{t('apply')}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;