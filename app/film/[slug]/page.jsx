import { FilmPage } from '../../../components/filmPage';
import { CardsDataProvider } from '../../../lib/CardsDataProvider';

export default async function Page({ params }) {
	
	// Extract the slug from params
	const { slug } = await params
	
	return (
		<CardsDataProvider>
			<FilmPage path={slug}></FilmPage>
		</CardsDataProvider>
	)
}