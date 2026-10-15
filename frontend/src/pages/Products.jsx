import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../context/../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { Sparkles, PackageSearch, AlertTriangle, RefreshCw } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (category && category !== 'all') params.append('category', category);
      if (sortBy) params.append('sort', sortBy);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data.success) {
        setProducts(res.data.products || []);
        if (res.data.categories && res.data.categories.length > 0) {
          setCategories(res.data.categories);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      setError(err.response?.data?.message || 'Could not connect to product catalog server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, category, sortBy]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Hero Showcase */}
      <section className="hero">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-glass)', border: '1px solid var(--border-subtle)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: '600', color: 'var(--primary-light)', marginBottom: '1rem' }}>
          <Sparkles size={14} /> Curated Tech, Audio & Lifestyle Gear
        </div>
        <h1 className="hero-title">Experience Premium Shopping</h1>
        <p className="hero-subtitle">
          Explore top-tier devices, guaranteed authentic warranties, instant digital tracking, and seamless checkout.
        </p>
      </section>

      {/* Search, Filter, Sort Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        category={category}
        setCategory={setCategory}
        categories={categories}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Resilient UI State 1: Loading */}
      {loading && (
        <div className="state-container glass-panel">
          <div className="spinner"></div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Loading Catalog...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Fetching latest inventory and real-time pricing</p>
        </div>
      )}

      {/* Resilient UI State 2: Error */}
      {!loading && error && (
        <div className="state-container glass-panel">
          <AlertTriangle size={48} color="#fb7185" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#fb7185' }}>
            Catalog Error
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '420px' }}>
            {error}
          </p>
          <button onClick={fetchProducts} className="btn btn-secondary">
            <RefreshCw size={16} /> Try Again
          </button>
        </div>
      )}

      {/* Resilient UI State 3: Empty Results */}
      {!loading && !error && products.length === 0 && (
        <div className="state-container glass-panel">
          <PackageSearch size={54} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No Products Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            No items matched your search "{searchQuery}" or selected filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategory('all');
              setSortBy('newest');
            }}
            className="btn btn-primary btn-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing <strong style={{ color: 'var(--text-main)' }}>{products.length}</strong> items
            </span>
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
