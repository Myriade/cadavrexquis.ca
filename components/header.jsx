'use client'
import Image from 'next/image'
import Link from 'next/link'
import styled from 'styled-components'
import { OffCanvas } from '../components/offCanvas'
import { SearchTool } from '../components/searchTool'
import tempLogo from 'public/images/cadavre-exquis-logo.svg'

const Styled = styled.header`
  z-index: 50;
  
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
  return (<Styled>
    <div className="header__container grid gap-4 pt-6 pb-10">
      <OffCanvas />
      
      <Link href="/">
        <Image src={tempLogo} alt="Cadavre exquis" className="w-40"/>
      </Link>
      
      <div>
        <SearchTool />
      </div>
      
    </div>
  </Styled>);
}
