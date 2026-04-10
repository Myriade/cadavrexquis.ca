import { Metadata } from 'next'
import ContentCatalogue from '../../components/ContentCatalogue';
import { CardsDataProvider } from '../../lib/CardsDataProvider';

export const metadata = {
  title: 'Collection - Cadavre exquis',
  description: 'Les films de la collection originale du projet Cadavre Exquis',
}

export default async function Page() {
  return (
    <CardsDataProvider>
      <ContentCatalogue isCollection />
    </CardsDataProvider>
  );
}

