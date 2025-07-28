import { DrupalPage } from '../../components/drupalPage';

// export const metadata = {
//   title: 'À propos'
// };

export default async function Page() {
    
  return (
    <main>
      <h1>À propos</h1>
      <DrupalPage nid={45}></DrupalPage>
    </main>
  );
}
