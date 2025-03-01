"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAllProducts } from '../../Services/Product';

const Search = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const ITEMS_PER_PAGE = 12;
  const SLIDING_WINDOW = 3;

  const loadProducts = useCallback(async () => {
    try {
      const allProducts = await getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, []);

  useEffect(() => {
    if (query) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
    } else {
      setFilteredProducts([]);
      setDisplayedProducts([]);
    }
    setActiveIndex(-1);
  }, [query, products]);

  const loadMoreItems = useCallback(() => {
    if (filteredProducts.length > displayedProducts.length) {
      const currentLength = displayedProducts.length;
      const nextItems = filteredProducts.slice(0, currentLength + SLIDING_WINDOW);
      setDisplayedProducts(nextItems);
    }
  }, [filteredProducts, displayedProducts.length, SLIDING_WINDOW]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Fetch products when input is focused
    if (products.length === 0) {
      loadProducts();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prevIndex) => {
        const newIndex = Math.min(prevIndex + 1, filteredProducts.length - 1);
        
        if (newIndex >= displayedProducts.length - 2) {
          loadMoreItems();
        }
        
        return newIndex;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    } else if (event.key === 'Enter' && activeIndex !== -1) {
      const selectedProduct = displayedProducts[activeIndex];
      router.push(`/product/${selectedProduct.id}`);
    }
  };

  return (
    <div className="col-sm-10 d-flex" style={{ marginTop: '30px', position: 'relative' }}>
      <input
        type="text"
        className="form-control"
        placeholder="Search products..."
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        style={{ flex: 10, marginRight: '10px' }}
      />
      {displayedProducts.length > 0 && (
        <ul 
          className="list-group" 
          style={{ 
            position: 'absolute', 
            zIndex: 1000, 
            marginTop: '40px', 
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {displayedProducts.map((product, index) => (
            <li
              key={product.id}
              className={`list-group-item ${index === activeIndex ? 'active' : ''}`}
              style={{ 
                cursor: 'pointer',
                backgroundColor: index === activeIndex ? '#e9ecef' : 'white',
                transition: 'background-color 0.2s ease'
              }}
              onClick={() => router.push(`/product/${product.id}`)}
            >
              <div className="d-flex align-items-center">
                <span>{product.name}</span>
                {index === activeIndex && (
                  <small className="text-muted ml-auto">
                    Press Enter to select
                  </small>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;