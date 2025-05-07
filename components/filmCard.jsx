'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';

const Styled = styled.div`
  --padding: 1.25rem;
  
  display: grid;
  container-type: inline-size;
  overflow: hidden;
  
  .card__inner {
    display: grid;
    overflow: hidden;}
  
  a.film {
    display: grid;
    align-content: space-between;
    break-inside: avoid-column;
    margin-bottom: var(--ficheMarge);
    padding: var(--padding);
      &:hover {
        text-decoration: none;}}
    
  h2 {
    font-weight: normal;
    text-wrap: balance;
    word-break: normal;
    max-width: 21ch;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export function FilmCard({filmdata}) {
  
  const filmAlias = filmdata.path ? `/film${filmdata.path.alias}` : '#'
  
  return (
    <Styled
      className={`card category-${filmdata.styles.categorie.id}`}
      style={{minHeight: filmdata.styles.elemHeight}}
    >
      <div className='card__inner' data-cardindex={filmdata.filmIndex}>
        <a
          href={ filmAlias }
          className="film"
          style={{background: filmdata.styles.couleur}}
        >
          <h2>{filmdata.title}</h2>
          <div>
            <p><i>[{filmdata.filmIndex + 1}]</i> {filmdata.field_annees_de_sortie}<br/>
            {filmdata.styles.categorie.nom}
            {/* filmdata.field_duree ? `${filmdata.field_duree}` : '' */}</p>
          </div>
        </a>
      </div>
    </Styled>
  );
};
