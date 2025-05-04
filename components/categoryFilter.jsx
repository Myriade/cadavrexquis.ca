'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';

const Styled = styled.section`
  display: flex;
  gap: 2rem;
  justify-content: center;
  
  button {
    &.selected {
      background: #000;
      color: #fff;
    }
  }
`;

// temporaire dev
const categories = [{nom:'Biologie', id:1}, {nom: 'Chimie', id:2}, {nom:'Santé mentale',id:3}, {nom:'Botanique',id:4}, {nom:'Médecine',id:5}]

export function CategoryFilter({ onCategoryChange }) {
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
      className='mb-6'
      ref={wrapElem}
    >
      <button 
        className='button'
        onClick={ (e) => {
          onBtnClick(e)
          onCategoryChange('all')
        }}
      >Tous</button>
      {categories.map( category => (
        <button 
          className='button' 
          key={category.id}
          onClick={ (e) => {
            onBtnClick(e)
            onCategoryChange(category.id)
          }}
        >
          {category.nom}
        </button>
      ))}
    </Styled>
  );
};
