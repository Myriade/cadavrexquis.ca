'use client'
import React, { useState, useRef } from 'react'
import styled from 'styled-components';
import { drupal } from "/lib/drupal.ts"

const Styled = styled.section`
  
  @container (min-width: 250px) { }
    
  @container (min-width: 500px) { }
  
  @container (min-width: 750px) { }
  
  @container (min-width: 1000px) { }
  
`;

export function DrupalPage( {nid} ) {
  const [body, setBody] = useState('... chargement')
  const isDataReady = useRef(false);
  
  async function fetchData() {
    const fetchedData = await drupal.getResourceCollection("node--page", {
      params: {
        "filter[nid]": nid,
      },
      deserialize: false,
    })
    
    if (!isDataReady.current) {
      // console.log(fetchedData.data[0]);
      setBody(fetchedData.data[0].attributes.body.value)
      isDataReady.current = true
    }
  }
  
  fetchData();
  
  return (
    <>
      <Styled dangerouslySetInnerHTML={{__html: body}}></Styled>
    </>
  );
};
