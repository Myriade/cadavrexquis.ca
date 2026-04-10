import { Metadata } from 'next'
import ContentCatalogue from '../../components/ContentCatalogue';

export const metadata = {
  title: 'Remontage - Cadavre exquis',
  description: 'Les films de remontage du projet Cadavre Exquis, montés à partir de la collection',
}

export default async function Page() {
  return (
    <ContentCatalogue isRemontage />
  );
}
