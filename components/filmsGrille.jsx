'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"

const Styled = styled.section`
  --ficheWidth: 250px;
  container-type: inline-size;
  padding-block: 10vh;
  
  .grille {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap:0;
    height: 80vh;
    max-width: 100%;
    overflow: hidden;}
  
  .film {
    border: 1px dotted;
    width: var(--ficheWidth);}
    
  @container (min-width: 250px) {
    .grille {
      max-width: var(--ficheWidth);}
  }
    
  @container (min-width: 500px) {
    .grille {
      max-width: calc( var(--ficheWidth) * 2 );}
  }
  
  @container (min-width: 750px) {
    .grille {
      max-width: calc( var(--ficheWidth) * 3 );}
  }
  
  @container (min-width: 1000px) {
    .grille {
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
            
            const randomHeight = Math.floor(Math.random() * (50 - 20 + 1) + 20);
            
            return (
              <div 
                key={film.drupal_internal__nid}
                className="film p-4"
                style={{minHeight: `${randomHeight}%` }}
              >
                {film.title} <br/>
                <small>{film.field_annees_de_sortie}{film.field_duree ? `, ${film.field_duree}` : ''}</small>
              </div>
            )
          })}
        </div>
      </Styled>
    </>
  );
};
