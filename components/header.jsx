'use client'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { OffCanvas } from '../components/offCanvas'
import { SearchTool } from '../components/searchTool'
import logo from 'assets/cadavre-exquis-logo.svg'

const Styled = styled.header`
  z-index: 25;
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  background: white;
  padding-block: 2vh;
  margin-top: 2vh;
  
  .header__container {
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-items: center;
    & > :first-child {
      justify-self: start;}
    & > :last-child {
    justify-self: end;}
  }
`

export function Header() {
  return (
    <Styled>
      <div className="header__container grid gap-4 max-w-7xl mx-auto">
        <OffCanvas />
        
        <Link href="/">
          <Image src={logo} alt="Cadavre exquis" className="w-40"/>
        </Link>
        
        <div>
          <SearchTool />
        </div>
        
      </div>
    </Styled>
  );
}
