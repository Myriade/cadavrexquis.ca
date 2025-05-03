'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"

const Styled = styled.section`

  .type, .infos {
    color: var(--color-rouge);}
  
  @container (min-width: 250px) { }
    
  @container (min-width: 500px) { }
  
  @container (min-width: 750px) { }
  
  @container (min-width: 1000px) { }
  
`;

// const defautlFilm = {}

export function FilmPage( {path} ) {
  const [ film, setFilm ] = useState({});
  
  // get toute les nodes avec seulement leur path alias
  async function fetchFilm() {
    const fetchedData = await drupal.getResourceCollection("node--film", {
      params: {
        "fields[node--film]": "drupal_internal__nid,path"
      },
      deserialize: false,
    })
    
    // trouver le nid du node qui a le path.alias === au prop path
    const node = await fetchedData.data.filter((node) => node.attributes.path.alias === `/${path}`);
    
    // get le node complet avec le nid  
    const filmFetchedData = await drupal.getResource(
      "node--film",
      node[0].id
    )
    
    if (filmFetchedData.type) {
      setFilm(filmFetchedData);
    }
  }
  
  if (!film.type) {
    fetchFilm();
    //console.log('fetching film...')
  } else if (film.type === 'node--film'){
    //console.log(film)
  }
  
  return (
    <>
      <Styled>
        <img src='/images/video-temp.png' alt='' className='video mb-8'/>
        <p className='type text-xl mb-6'>Collection</p>
        <h1 className='mb-6'>{film.type ? film.title : ' '}</h1>
        <p className='infos text-xl font-sans mb-6'>
          {film.type ? film.field_annees_de_sortie : '... chargement'}
          {film.field_duree ? ` / ${film.field_duree}` : ''}
        </p>
        <div 
          dangerouslySetInnerHTML={film.type ? { __html: film.field_resume_de_l_institution_de.processed } : {__html: ''}}
          className='texte text-lg font-serif mb-6'
        ></div>
      </Styled>
    </>
  );
};
