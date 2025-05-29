'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

const Styled = styled.form`
  
`

export function SearchTool() {
  const [searchTerms, setSearchTerms] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerms.trim()) {
      function stringToUri(str) {
        const trimmed = str.trim();
        return encodeURIComponent(trimmed)
      };
      const uri = stringToUri(searchTerms);
      router.push(`/films/${uri}`);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setSearchTerms(e.target.value);
  };

  return (
    <Styled onSubmit={handleSubmit}>
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
    </Styled>
  );
}