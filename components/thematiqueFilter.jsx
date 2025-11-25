'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components'

const Styled = styled.section`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: space-between;
  
  button {
    &.selected {
      background: #000;
      color: #fff;
    }
  }
  
  @media (max-width: 500px) {
    gap: 0.25em;
    .button {
      padding: 0 0.5em;}
  }
`;

export function ThematiqueFilter({ allThematiques, onThematiqueChange, activeThematique }) {
  const wrapElem = useRef()
  
  if (wrapElem.current) {
    if (activeThematique && activeThematique !== 'all') {
      const allBtnElems = wrapElem.current.children
      const selectedElem = allBtnElems.namedItem(`term-id-${activeThematique}`)
      Array.from(allBtnElems).forEach( elem => elem.classList.remove('selected'))
      selectedElem.classList.add('selected')
    } else if (!activeThematique || activeThematique === 'all') {
      const allBtnElems = wrapElem.current.children
      Array.from(allBtnElems).forEach( elem => elem.classList.remove('selected'))
    }
  }
    
  return (
    <Styled
      ref={wrapElem}
    >
      <button 
        className='button'
        onClick={ (e) => {
          onThematiqueChange('all')
        }}
      >
        {allThematiques ? 'Tous' : '...'}
      </button>
      {allThematiques ? allThematiques.map( thematique => (
        <button 
          className='button' 
          id={`term-id-${thematique.attributes.termid}`}
          key={thematique.attributes.termid}
          onClick={ (e) => {
            onThematiqueChange(thematique.attributes.termid)
          }}
        >
          {thematique.attributes.name}
        </button>
      )) : ''}
    </Styled>
  );
};
