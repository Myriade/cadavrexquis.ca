'use client'
import Link from 'next/link' 
import Image from 'next/image'
import { Menu } from '../components/menu'
import styled from 'styled-components';
import logoZoom from 'assets/logo-zoom-out.svg'
import logoOff from 'assets/logo-off-screen.svg'
import logoHors from 'assets/logo-hors-champ.svg'
import logoCac from 'assets/logo-cac.svg'
import logoCam from 'assets/logo-cam.svg'
import logoCinex from 'assets/logo-cinexmedia.png'
import logoLabo from 'assets/logo-labocinemedias.png'

const Styled = styled.footer`
  .logos {
    img {
      filter: saturate(0);
      opacity: 0.4;}
    a {
      display: grid;
      align-content: center;
    }
  }
    
  a:hover img {
    filter: saturate(1);
    opacity: 1;
  }
`


export function Footer() {
  return (
    <Styled>
      <Menu />
      
      <hr className='my-8'/>
      
      <div className='logos flex gap-10 flex-wrap'>
        <a href='https://zoom-out.ca/' target='_blank'>
          <Image src={logoZoom} alt="Zoom out" className="h-25"/>
        </a>
        <a href='https://offscreen.com/' target='_blank'>
          <Image src={logoOff} alt="Off screen" className="h-25"/>
        </a>
        <a href='https://horschamp.qc.ca/' target='_blank'>
          <Image src={logoHors} alt="Hors champ" className="h-25"/>
        </a>
        <a href='https://canadacouncil.ca/' target='_blank'>
          <Image src={logoCac} alt="Conseil des arts du Canada" className="h-25"/>
        </a>
        <a href='https://www.artsmontreal.org/' target='_blank'>
          <Image src={logoCam} alt="Conseil des arts de Montréal" className="h-25"/>
        </a>
        <a href='https://labocinemedias.ca/cinexmedia/' target='_blank'>
          <Image src={logoCinex} alt="cinEXmedia" className="h-12 w-auto"/>
        </a>
        <a href='https://labocinemedias.ca' target='_blank'>
          <Image src={logoLabo} alt="Laboratoire CinéMédias" className="h-12 w-auto"/>
        </a>
      </div>
    </Styled>
  );
};
