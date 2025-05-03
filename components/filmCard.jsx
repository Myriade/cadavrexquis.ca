'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';

const Styled = styled.div`
  --ficheWidth: 250px;
  container-type: inline-size;
  
  .film {
    display: block;
    overflow: hidden;
    break-inside: avoid-column;
    border: 1px dotted;
    width: var(--ficheWidth);
    height: 0;
    transition: all 0.7s ease-in;}
  
  .film.hidden {
    border: 0;}
`;

export function FilmCard({filmdata, styles}) {
  
  const filmAlias = filmdata.path ? `/film${filmdata.path.alias}` : '#'
  
  return (
    <>
      <Styled>
        <a
          href={ filmAlias }
          className="film p-4"
          style={{minHeight: styles.elemHeight}}
        >
          {filmdata.filmIndex} {filmdata.title}<br/>
          <small>{filmdata.field_annees_de_sortie}{filmdata.field_duree ? `, ${filmdata.field_duree}` : ''}</small>
        </a>
      </Styled>
    </>
  );
};
