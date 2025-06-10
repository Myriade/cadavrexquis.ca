import { SearchPage } from '../../../components/searchPage';

export default async function Page({ params }) {
	
	// Extract the slug from params
	const { slug } = await params
	
	return (
		<main>
			<SearchPage searchSlug={slug}></SearchPage>
		</main>
	)
}