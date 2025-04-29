'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"

const Styled = styled.section`
  --ficheWidth: 250px;
  container-type: inline-size;
  padding-block: 10vh;
  
  .grille {
    column-count: 1;
    column-gap: 0;
    max-width: var(--ficheWidth);
  }
  
  .film {
    display: block;
    break-inside: avoid-column;
    border: 1px dotted;
    width: var(--ficheWidth);}
  
  @container (min-width: 500px) {
    .grille {
      column-count: 2;
      max-width: calc( var(--ficheWidth) * 2 );}
  }
 
  @container (min-width: 750px) {
   .grille {
      column-count: 3;
      max-width: calc( var(--ficheWidth) * 3 );}
  }
  
  @container (min-width: 1000px) {
    .grille {
      column-count: 4;
      max-width: calc( var(--ficheWidth) * 4 );}
  }
  
`;

const defautlFilm = {attributes: {
  drupal_internal__nid: 0,
  title: '...',
  field_annees_de_sortie: 'chargement'
}}

export function FilmsGrille() {
  const [films, setFilms] = useState([defautlFilm]);
  const isDataReady = useRef(false);
  
  async function fetchData() {
    const fetchedData = await drupal.getResourceCollection("node--film", {
      params: {
        //"filter[status]": "1",
      },
      deserialize: false,
    })
    
    if (!isDataReady.current) {
      //console.log(fetchedData.data[1].attributes);
      const randomizedData = fetchedData.data.sort((a, b) => 0.5 - Math.random());
      setFilms(randomizedData)
      isDataReady.current = true
    }
  }
  
  fetchData();
  
  return (
    <>
      <Styled>
        <div className="grille">
          {films.map( item => { 
            const film = item.attributes;
            
            const randomHeight = Math.random() * (1.5 - 0.5) + 0.5;
            
            return (
              <a 
                key={film.drupal_internal__nid}
                href={ film.path ? `/film${film.path.alias}` : '#' }
                className="film p-4"
                style={{minHeight: `calc(var(--ficheWidth) * ${randomHeight})` }}
              >
                {film.title} <br/>
                <small>{film.field_annees_de_sortie}{film.field_duree ? `, ${film.field_duree}` : ''}</small>
                <div>{ film.path || !isDataReady.current ? '' : '!! pas de path !!' }</div>
              </a>
            )
          })}
        </div>
      </Styled>
    </>
  );
};
