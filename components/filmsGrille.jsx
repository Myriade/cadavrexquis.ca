'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"

const Styled = styled.section`
  width: 1015px;
  padding-block: 10vh;
  
  .grille {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    gap: 5px;
    height: 80vh;
    max-width: 100%;
    overflow: hidden;
  }
  
  .film {
    width: 250px;
  }
`;

export function FilmsGrille() {
  const [films, setFilms] = useState([]);
  const isDataReady = useRef(false);
  
  async function fetchData() {
    const fetchedData = await drupal.getResourceCollection("node--film", {
      params: {
        //"filter[status]": "1",
      },
      deserialize: false,
    })
    
    //console.log(fetchedData.data[1].attributes);
    if (!isDataReady.current) {
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
            
            const randomHeight = Math.floor(Math.random() * (50 - 13 + 1) + 13);
            
            return (
              <div 
                key={film.drupal_internal__nid}
                className="film border p-4"
                style={{minHeight: `${randomHeight}%` }}
              >
                {film.title}
              </div>
            )
          })}
        </div>
      </Styled>
    </>
  );
};
