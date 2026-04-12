import { Metadata } from 'next'
import { DrupalPage } from '../../components/drupalPage';

export const metadata = {
  title: 'Code d’éthique du réemploi',
  description: 'Code d’éthique du réemploi des films de la collection Cadavre Exquis',
  alternates: { canonical: `/code-ethique/` },
  openGraph: {
    title: 'Code d’éthique du réemploi - Cadavre exquis',
    description: 'Code d’éthique du réemploi des films de la collection Cadavre Exquis',
    url: '/code-ethique/',
    images: [{ url: '/cadavdre-exquis-og-pages.png' }],
  },
};

export default async function Page() {
  return (
    <main>
      <h1>Code d’éthique du réemploi</h1>
      <DrupalPage nid={46}></DrupalPage>
    </main>
  );
}

