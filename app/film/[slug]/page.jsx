import { FilmPage } from '../../../components/filmPage';
import { CardsDataProvider } from '../../../lib/CardsDataProvider';
import { fetchFilmMetadata } from '../../../lib/fetchNodeMetadata';

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const film = await fetchFilmMetadata(slug);

	if (!film) {
		return { title: "Film - Cadavre exquis", alternates: { canonical: `/film/${slug}` } };
	}

	const title = `${film.title} - Cadavre exquis`;
	
	// description: built from year + thématique names (e.g. "1965 — Documentaire, Expérimental")
	let description = "";
	if (film.year) {
		description = film.year;
		if (film.thematiques && film.thematiques.length > 0) {
			description += ` — ${film.thematiques.join(", ")}`;
		}
	} else if (film.thematiques && film.thematiques.length > 0) {
		description = film.thematiques.join(", ");
	}

	const metadata = {
		title: title,
		description: description,
		alternates: { canonical: `/film/${slug}` },
		openGraph: {
			title: title,
			description: description,
			type: "video.movie",
		},
	};

	if (film.imageUrl) {
		metadata.openGraph.images = [{ url: film.imageUrl }];
	}

	return metadata;
}

export default async function Page({ params }) {

	// Extract the slug from params
	const { slug } = await params
	
	return (
		<CardsDataProvider>
			<FilmPage path={slug}></FilmPage>
		</CardsDataProvider>
	)
}