import { FilmPage } from '../../../components/filmPage';

export default async function Page({ params }) {
	
	// Extract the slug from params
	const { slug } = await params
	
	return (
		<FilmPage path={slug}></FilmPage>
	)
}