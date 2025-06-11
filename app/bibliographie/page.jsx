import { DrupalPage } from '../../components/drupalPage';

export const metadata = {
  title: 'Bibliographie et ressources documentaires'
};

export default async function Page() {
  return (
    <main>
      <h1>Bibliographie et ressources documentaires</h1>
      <DrupalPage nid={58}></DrupalPage>
    </main>
  );
}

