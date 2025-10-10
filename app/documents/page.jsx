import { Metadata } from 'next'
import ContentLoader from '../../components/contentLoader';

export const metadata = {
  title: 'Documents - Cadavre exquis',
  description: 'Des articles et oeuvres autour du projet Cadavre Exquis',
}

export default async function Page() {
  return (
    <ContentLoader isDocuments />
  );
}

