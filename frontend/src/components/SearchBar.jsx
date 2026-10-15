import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  categories,
  sortBy,
  setSortBy
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', flex: '1 1 300px' }}>
        <Search
          size={18}
          color="var(--text-dim)"
          style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
        />
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ paddingLeft: '2.5rem' }}
        />
      </div>

      {/* Category Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 1 200px' }}>
        <Filter size={16} color="var(--text-dim)" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 1 210px' }}>
        <ArrowUpDown size={16} color="var(--text-dim)" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Customer Rated</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
