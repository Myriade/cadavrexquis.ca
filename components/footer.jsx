'use client'
import Link from 'next/link';
import { Menu } from '../components/menu'
import styled from 'styled-components';

const Styled = styled.footer`
  
`

export function Footer() {
  return (
    <Styled>
      <Menu />
      
      <hr className='my-8'/>
      
      <p>[logos]</p>
    </Styled>
  );
};
