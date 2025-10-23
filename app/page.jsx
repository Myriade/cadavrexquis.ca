import ContentLoader from '../components/contentLoader';
import Mission from '../components/mission';

export const metadata = {
  title: 'Cadavre exquis',
  description: 'Cadavre exquis, “ouvroir de cinéma potentiel” (OUCIPO), est un laboratoire de valorisation patrimoniale et de création expérimentale, dédié au cinéma scientifique et éducatif. Il a été initié par la revue Hors champ en 2021',
}

export default function Page() {
  return (<>
    <ContentLoader/>
    <hr/>
    <Mission />
  </>);
}
