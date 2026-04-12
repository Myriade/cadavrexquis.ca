import { SearchPage } from '../../../components/searchPage';
import { uriToString } from '../../../lib/utils';

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const slugString = await uriToString(slug);
	return {
		title: `Recherche «${slugString}» - Cadavre exquis`,
		description: 'Rechercher parmi les films et les documents du projet Cadavre Exquis',
		alternates: { canonical: `/recherche/${slug}` },
		openGraph: {
			title: `Recherche «${slugString}» - Cadavre exquis`,
			description: 'Rechercher parmi les films et les documents du projet Cadavre Exquis',
			url: `/recherche/${slug}`,
			images: [{ url: '/cadavdre-exquis-og-pages.png' }],
		}
	}
}

export default async function Page({ params }) {
	
	// Extract the slug from params
	const { slug } = await params
	
	return (
		<main>
			<SearchPage searchSlug={slug}></SearchPage>
		</main>
	)
}