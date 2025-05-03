'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';

const Styled = styled.section`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

// temporaire dev
const categories = ['Biologie', 'Chimie', 'Santé mentale', 'Botanique', 'Médecine']

export function CategoryFilter({ onSendMessage }) {
  
  // Event handler
  // function categorySelect(i) {
  //   const catId = i;
  //   const catName = categories[i]
  //   console.log('categorySelect', catId, catName)
  // }
  
  return (
    <Styled
      className='mb-6'
    >
      {categories.map( (category , index) => (
        <button 
          className='button' 
          key={index}
          onClick={ () => 
            onSendMessage(index)
          }
        >
          {category}
        </button>
      ))}
    </Styled>
  );
};
