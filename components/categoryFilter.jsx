'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useLoadTaxonomies } from '../lib/fecthDrupalData'

const Styled = styled.section`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  
  button {
    &.selected {
      background: #000;
      color: #fff;
    }
  }
`;

export function CategoryFilter({ onCategoryChange }) {
  const [categories, setCategories] = useState()
  const wrapElem = useRef()
  
  const { data: taxonomyData, loading, error } = useLoadTaxonomies()
  //console.log('taxonomyData', taxonomyData.site_categorie)
  
  if (taxonomyData && !categories) {
    setCategories(taxonomyData.site_categorie)
  }
  
  // Click Event handlers
  function onBtnClick(e) {
    const allBtnElems = wrapElem.current.children
    const selectedElem = e.target
    Array.from(allBtnElems).forEach( elem => elem.classList.remove('selected'))
    selectedElem.classList.add('selected')
  }
  
  function resetAll(e) {
    const allBtnElems = wrapElem.current.children
    Array.from(allBtnElems).forEach( elem => elem.classList.remove('selected'))
  }
    
  return (
    <Styled
      ref={wrapElem}
    >
      <button 
        className='button'
        onClick={ (e) => {
          onBtnClick(e)
          onCategoryChange('all')
        }}
      >Tous</button>
      {categories ? categories.map( category => (
        <button 
          className='button' 
          key={category.id}
          onClick={ (e) => {
            onBtnClick(e)
            onCategoryChange(category.id)
          }}
        >
          {category.name}
        </button>
      )) : ''}
    </Styled>
  );
};
