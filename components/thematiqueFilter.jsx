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

export function ThematiqueFilter({ onThematiqueChange }) {
  const [thematiques, setThematiques] = useState()
  const wrapElem = useRef()
  
  const { data: taxonomyData, loading, error } = useLoadTaxonomies()
  
  if (taxonomyData && !thematiques) {
    setThematiques(taxonomyData.site_categorie)
  }
  
  // console.log('thematiques', thematiques)
  
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
          onThematiqueChange('all')
        }}
      >Tous</button>
      {thematiques ? thematiques.map( thematique => (
        <button 
          className='button' 
          key={thematique.id}
          onClick={ (e) => {
            onBtnClick(e)
            onThematiqueChange(thematique.id)
          }}
        >
          {thematique.name}
        </button>
      )) : ''}
    </Styled>
  );
};
