import { DrupalPage } from '../../components/drupalPage';

// export const metadata = {
//   title: 'Code d’éthique du réemploi'
// };

export default async function Page() {
  return (
    <main>
      <h1>Code d’éthique du réemploi</h1>
      <DrupalPage nid={46}></DrupalPage>
    </main>
  );
}

