import { Metadata } from 'next'
import ContentCatalogue from '../../components/ContentCatalogue';
import { CardsDataProvider } from '../../lib/CardsDataProvider';

export const metadata = {
  title: 'Documents - Cadavre exquis',
  description: 'Des articles et oeuvres autour du projet Cadavre Exquis',
  alternates: { canonical: `/documents/` },
  openGraph: {
    title: 'Documents - Cadavre exquis',
    description: 'Des articles et oeuvres autour du projet Cadavre Exquis',
    url: '/documents/',
    images: [{ url: '/cadavdre-exquis-og-pages.png' }],
  },
}

export default async function Page() {
  return (
    <CardsDataProvider>
      <ContentCatalogue isDocuments />
    </CardsDataProvider>
  );
}

