import { Metadata } from 'next'
import ContentCatalogue from '../../components/ContentCatalogue';
import { CardsDataProvider } from '../../lib/CardsDataProvider';

export const metadata = {
  title: 'Documents - Cadavre exquis',
  description: 'Des articles et oeuvres autour du projet Cadavre Exquis',
}

export default async function Page() {
  return (
    <CardsDataProvider>
      <ContentCatalogue isDocuments />
    </CardsDataProvider>
  );
}

