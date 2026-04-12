import { Metadata } from 'next'
import { SearchTool } from '../../components/searchTool';

export const metadata = {
	title: 'Recherche - Cadavre exquis',
	description: 'Rechercher parmi les films et les documents du projet Cadavre Exquis',
	alternates: { canonical: `/recherche/` },
	openGraph: {
		title: 'Recherche - Cadavre exquis',
		description: 'Rechercher parmi les films et les documents du projet Cadavre Exquis',
		url: '/recherche/',
		images: [{ url: '/cadavdre-exquis-og-pages.png' }],
	},
}

export default async function Page({ params }) {
	
	// Extract the slug from params
	const { slug } = await params
	
	return (
		<main>
			<h2>Recherche</h2>
			<p className='mb-4'>Entrez un terme dans l’outil ci-dessous pour chercher parmi les films et documents.</p>
			<SearchTool isFullWidth />
		</main>
	)
}