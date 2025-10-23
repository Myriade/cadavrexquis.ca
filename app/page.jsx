import ContentLoader from '../components/contentLoader';
import Mission from '../components/mission';

export const metadata = {
  title: 'Cadavre exquis, “ouvroir de cinéma potentiel” (OUCIPO)',
  description: 'Cadavre exquis est un laboratoire de valorisation patrimoniale et de création expérimentale, dédié au cinéma scientifique et éducatif.',
  openGraph: {
    title: 'Cadavre exquis, “ouvroir de cinéma potentiel” (OUCIPO)',
    description: 'Cadavre exquis est un laboratoire de valorisation patrimoniale et de création expérimentale, dédié au cinéma scientifique et éducatif.',
    url: 'https://cadavrexquis.ca/',
    siteName: 'Cadavre exquis',
    images: [
      {
        url: 'https://cadavrexquis.ca/cadavrexquis.ca-og.png',
        width: 1200,
        height: 620,
        alt: 'Cadavre Exquis, Sciences naturelles, Santé et sciences de la vie humaine, Mathématiques, Technologie',
      },
    ],
    videos: [
      {
        url: 'https://vimeo.com/1102788773/86739cff75',
        width: 1920,
        height: 1080,
      },
    ],
    locale: 'fr_CA',
    type: 'website',
  },
  alternates: {
    canonical: 'https://cadavrexquis.ca/'
  }
}

export default function Page() {
  return (<>
    <ContentLoader/>
    <hr/>
    <Mission />
  </>);
}
