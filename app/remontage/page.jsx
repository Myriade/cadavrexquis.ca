import { Metadata } from 'next'
import ContentLoader from '../../components/contentLoader';

export const metadata = {
  title: 'Remontage - Cadavre exquis',
  description: 'Les films de remontage du projet Cadavre Exquis, montés à partir de la collection',
}

export default async function Page() {
  return (
    <ContentLoader isRemontage />
  );
}
