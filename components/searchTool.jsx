'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import styled from 'styled-components'

const SearchIcon = () => {
  return (
    <svg
      width='19.02'
      height='18.92'
      viewBox="0 0 19.02 18.92"
      aria-hidden="true"
    >
      <defs>
        <style>
          {`.search-icon-path {
              fill: none;
              stroke: #000;
              stroke-width: 1;
              stroke-miterlimit: 10;
          }`}
        </style>
      </defs>
      <g>
        <path
          className="search-icon-path"
          d="M13.53,7.01c0,3.6-2.92,6.51-6.51,6.51S.5,10.61.5,7.01,3.42.5,7.01.5s6.51,2.92,6.51,6.51h0Z"
        />
        <line
          className="search-icon-path"
          x1="11.6"
          y1="11.5"
          x2="18.67"
          y2="18.57"
        />
      </g>
    </svg>
  );
};

const Styled = styled.form`
  display: flex;
  gap: 0.25rem;
  justify-content: space-between;
  
  &.focus {
    border: 1px solid black;}
  
  input {
    width: 0;
    max-width: 0;
    padding: 0.25em 0.5em;
    transition: width 0.4s;}
  
  &.focus input,
  input:focus {
    width: 30ch;
    max-width: 60vw;}
    
  input.full-width,
  input.full-width:focus {
    width: 100ch;
    max-width: 70vw;}
  
  button {
    padding-inline: 0.5em;
    
  &:hover {
    cursor: pointer;
    background: #000;
    path, line {
      stroke: #fff;}
  }}
  
  @media (min-width: 500px) { 
    border: 1px solid black;
    gap: 1rem;
    input {
     width: 10ch;
     max-width: 10ch;}
  }
`

export function SearchTool({isFullWidth}) {
  const [searchTerms, setSearchTerms] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerms.trim()) {
      e.target[0].classList.remove('focus')
      function stringToUri(str) {
        const trimmed = str.trim();
        return encodeURIComponent(trimmed)
      };
      const uri = stringToUri(searchTerms);
      router.push(`/recherche/${uri}`);
      setSearchTerms('')
    } else {
      e.target.classList.toggle('focus')
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setSearchTerms(e.target.value);
  };

  return (
    <Styled onSubmit={handleSubmit}>
      <input
        type='text'
        name='search-terms'
        id='searchtool'
        value={searchTerms}
        onChange={handleChange}
        placeholder="Chercher"
        aria-label="Rechercher un terme"
        className={ isFullWidth ? 'full-width' : ''}
      />
      <button type="submit" aria-label="Search">
        <SearchIcon />
      </button>
    </Styled>
  );
}