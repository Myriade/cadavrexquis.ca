import { Metadata } from 'next'
import ContentCatalogue from '../../components/ContentCatalogue';
import { CardsDataProvider } from '../../lib/CardsDataProvider';

export const metadata = {
  title: 'Remontage - Cadavre exquis',
  description: 'Les films de remontage du projet Cadavre Exquis, montés à partir de la collection',
  alternates: { canonical: `/remontage/` },
  openGraph: {
    title: 'Remontage - Cadavre exquis',
    description: 'Les films de remontage du projet Cadavre Exquis, montés à partir de la collection',
    url: '/remontage/',
    images: [{ url: '/cadavdre-exquis-og-pages.png' }],
  },
}

export default async function Page() {
  return (
    <CardsDataProvider>
      <ContentCatalogue isRemontage />
    </CardsDataProvider>
  );
}
