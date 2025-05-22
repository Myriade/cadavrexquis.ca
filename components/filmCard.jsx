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
  const photogrammeUrl = filmdata.styles.photogramme ? `/images/${filmdata.styles.photogramme}` : ''
  
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
  
  return (
    <Styled
      className='card'
      style={{minHeight: filmdata.styles.elemHeight}}
      ref={gsapCardContainer}
    >
      <div className='card__inner' data-cardindex={filmdata.filmIndex}>
        <a 
          className='card__infos'
          style={{background: filmdata.styles.couleur}}
          href={ filmAlias }
        >
          <h2>{filmdata.title}</h2>
          <div>
            <p>{filmdata.field_annees_de_sortie}<br/>
            {filmdata.filmThematiques.noms}</p>
          </div>
        </a>
        <div 
          className='card__image' 
          ref={imageElemRef}
          style={{ 
            backgroundImage: `url(${photogrammeUrl})`, 
            backgroundPosition: filmdata.styles.focus
          }} 
        ></div>
      </div>
    </Styled>
  );
};
