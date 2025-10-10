import { Metadata } from 'next'
import { DrupalPage } from '../../components/drupalPage';

export const metadata = {
  title: 'À propos - Cadavre exquis',
  description: 'Cadavre exquis, “ouvroir de cinéma potentiel” (OUCIPO), est un laboratoire de valorisation patrimoniale et de création expérimentale, dédié au cinéma scientifique et éducatif. Il a été initié par la revue Hors champ en 2021',
}
export default async function Page() {
    
  return (
    <main>
      <h1>À propos</h1>
      <DrupalPage nid={45}></DrupalPage>
    </main>
  );
}
