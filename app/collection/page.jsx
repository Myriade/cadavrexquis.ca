import { Metadata } from 'next'
import ContentLoader from '../../components/contentLoader';

export const metadata = {
  title: 'Collection - Cadavre exquis',
  description: 'Les films de la collection originale du projet Cadavre Exquis',
}

export default async function Page() {
  return (
    <ContentLoader isCollection />
  );
}

