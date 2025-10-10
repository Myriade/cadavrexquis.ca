import { Metadata } from 'next'
import { DrupalPage } from '../../components/drupalPage';

export const metadata = {
  title: 'Bibliographie - Cadavre exquis',
  description: 'Bibliographie et ressources documentaires pour le projet Cadavre exquis',
}
export default async function Page() {
  return (
    <main>
      <h1>Bibliographie et ressources documentaires</h1>
      <DrupalPage nid={58}></DrupalPage>
    </main>
  );
}

