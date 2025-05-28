'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import { slugify } from '../lib/utils.ts';
import styled from 'styled-components'

const Styled = styled.div`
  
`

export function SearchTool() {
  const [searchTerms, setSearchTerms] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerms.trim()) {
      const slug = slugify(searchTerms);
      router.push(`/films/${slug}`);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setSearchTerms(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="search-container">
        <input
          type='text'
          name='search-terms'
          id='searchtool'
          value={searchTerms}
          onChange={handleChange}
          placeholder="Entrer un ou des termes"
          aria-label="Rechercher un terme"
        />
        <button type="submit" aria-label="Search">
          Search
        </button>
      </div>
    </form>
  );
}