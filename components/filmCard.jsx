'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';

const Styled = styled.div`
  --padding: 1.25rem;
  container-type: inline-size;
  padding: 0 3px 6px;
  
  .film {
    display: grid;
    align-content: space-between;
    break-inside: avoid-column;
    padding: var(--padding);}
    
  h2 {
    font-weight: 500;
    text-wrap: balance;
    overflow-wrap: break-word;
    word-break: normal;
    max-width: calc(var(--ficheWidth) - (var(--padding) * 2) );
  }
`;

export function FilmCard({filmdata}) {
  
  const filmAlias = filmdata.path ? `/film${filmdata.path.alias}` : '#'
  
  return (
    <>
      <Styled>
        <a
          href={ filmAlias }
          className="film"
          style={{
            minHeight: filmdata.styles.elemHeight, 
            background: filmdata.styles.couleur
          }}
        >
          <h2>{filmdata.title}</h2>
          <div>
            <p><i>[{filmdata.filmIndex + 1}]</i> {filmdata.field_annees_de_sortie}<br/>
            {filmdata.field_duree ? `${filmdata.field_duree}` : ''}</p>
          </div>
        </a>
      </Styled>
    </>
  );
};
