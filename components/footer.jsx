'use client'
import Link from 'next/link';
import styled from 'styled-components';

const navItems = [
  { linkText: 'À propos', href: '/a-propos' },
  { linkText: 'Code d’éthique du réemploi', href: 'code-ethique'},
  { linkText: 'Bibliographie et ressources documentaires', href: ''}
];

const Styled = styled.footer`
  border-top: 1px solid var(--color-gris);
`

export function Footer() {
  return (
    <Styled className="mt-8 mb-8 pt-6">
      {!!navItems?.length && (
        <ul className="grid gap-1">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="inline-block transition hover:opacity-80"
              >
                {item.linkText}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Styled>
  );
};
