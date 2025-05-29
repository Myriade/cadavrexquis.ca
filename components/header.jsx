'use client'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { Menu } from '../components/menu'
import { SearchTool } from '../components/searchTool'
import tempLogo from 'public/images/cadavre-exquis-logo.svg'

const Styled = styled.div`
  nav {
    display: grid;
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
  return (<Styled>
    <nav 
      className="gap-4 pt-6 pb-10" 
      role="navigation" 
      aria-label="Main menu"
    >
    
      <Menu />
      
      <Link href="/">
        <Image src={tempLogo} alt="Cadavre exquis" className="w-40"/>
      </Link>
      
      <div>
        <SearchTool />
      </div>
      
    </nav>
    
  </Styled>);
}
