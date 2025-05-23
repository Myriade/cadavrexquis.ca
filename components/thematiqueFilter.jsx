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
`;

export function ThematiqueFilter({ allThematiques, onThematiqueChange }) {
  const wrapElem = useRef()
  
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
      >
        {allThematiques ? 'Tous' : '...'}
      </button>
      {allThematiques ? allThematiques.map( thematique => (
        <button 
          className='button' 
          key={thematique.attributes.termid}
          onClick={ (e) => {
            onBtnClick(e)
            onThematiqueChange(thematique.attributes.termid)
          }}
        >
          {thematique.attributes.name}
        </button>
      )) : ''}
    </Styled>
  );
};
