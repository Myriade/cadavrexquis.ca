'use client'
import React, { useRef } from 'react'
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Styled = styled.div`
  --padding: 1.25rem;
  
  display: grid;
  container-type: inline-size;
  overflow: hidden;
  
  .card__inner {
    display: grid;
    grid-template: 1fr / 1fr;
    margin-bottom: var(--ficheMarge);
    overflow: hidden;}
  
  .card__image {
    grid-area: 1 / 1;
    display: grid;
    background-size: 300%;
    background-repeat: no-repeat;}
  
  .card__infos {
    grid-area: 1 / 1;
    padding: var(--padding);
    display: grid;
    align-content: space-between;
    break-inside: avoid-column;}
    
  h2 {
    font-weight: normal;
    text-wrap: balance;
    word-break: normal;
    max-width: 21ch;
    overflow: hidden;
    text-overflow: ellipsis;}
  
  a:hover {
    text-decoration: none;}
`;

export function FilmCard({filmdata, shouldwait}) {
  const gsapCardContainer = useRef()
  const imageElemRef = useRef()
  
  const filmAlias = filmdata.path ? `/film${filmdata.path.alias}` : '#'
  const photogrammeUrl = filmdata.filmImageUrl ? `https://database.cadavrexquis.ca/${filmdata.filmImageUrl}` : ''
  
  // GSAP
  const gsapCardInstance = useGSAP(() => {
    const imageElem = imageElemRef.current
    const waitTime = parseInt(shouldwait)
    
    let hide = gsap.to(imageElem, {
      yPercent: 100,
      y: 'bottom',
      duration: 0.4,
      ease: 'none',
    });
    hide.pause()
    
    const handleMouseEnter = (e) => {
      if ( e ) e.preventDefault()
      hide.play()
    };
    
    const handleMouseLeave = () => {
      hide.reverse()
    };
    
    setTimeout( () => {
      if (gsapCardContainer.current && imageElem) {
        gsapCardContainer.current.addEventListener("mouseover", () => handleMouseEnter());
        imageElem.addEventListener("touchstart", (e) => handleMouseEnter(e));
        gsapCardContainer.current.addEventListener("mouseout", handleMouseLeave);
      }
    }, waitTime)
  }, { dependencies: [imageElemRef], scope: gsapCardContainer })
    
  if (!filmdata) {
    return (
      <Styled
        className='card'
      >
        <div className='card__inner'>
          <div 
            className='card__infos'
          >
            <h2>... chargement</h2>
            <div>
              <p><br/>
              </p>
            </div>
          </div>
          <div 
            className='card__image' 
          ></div>
        </div>
      </Styled>
    )
  }
  
  return (
    <Styled
      className='card'
      style={ filmdata.styles ? {minHeight: filmdata.styles.elemHeight} : {}}
      ref={gsapCardContainer}
    >
      <div className='card__inner' data-cardindex={filmdata.filmIndex}>
        <a 
          className='card__infos'
          style={ filmdata.styles ? {background: filmdata.styles.couleur} : {background: 'var(--color-rouge)'}}
          href={ filmAlias }
        >
          <h2>{filmdata.title}</h2>
          <div>
            <p>{filmdata.field_annees_de_sortie}<br/>
            {filmdata.filmThematiques ? filmdata.filmThematiques.noms : ''}</p>
          </div>
        </a>
        <div 
          className='card__image' 
          ref={imageElemRef}
          style={ filmdata.styles ? { 
            backgroundImage: `url(${photogrammeUrl})`, 
            backgroundPosition: filmdata.styles.focus
          } : {}} 
        ></div>
      </div>
    </Styled>
  );
};
