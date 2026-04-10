import { Metadata } from 'next'
import ContentCatalogue from '../../components/ContentCatalogue';

export const metadata = {
  title: 'Documents - Cadavre exquis',
  description: 'Des articles et oeuvres autour du projet Cadavre Exquis',
}

export default async function Page() {
  return (
    <ContentCatalogue isDocuments />
  );
}

