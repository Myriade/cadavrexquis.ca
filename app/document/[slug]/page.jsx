import { DocumentPage } from '../../../components/documentPage';
import { fetchDocumentMetadata } from '../../../lib/fetchNodeMetadata';

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const doc = await fetchDocumentMetadata(slug);

	if (!doc) {
		return { title: "Document - Cadavre exquis", alternates: { canonical: `/document/${slug}` } };
	}

	const title = `${doc.title} - Cadavre exquis`;

	// description: built from year + thématique names (e.g. "1965 — Documentaire, Expérimental")
	let description = "";
	if (doc.year) {
		description = doc.year;
		if (doc.thematiques && doc.thematiques.length > 0) {
			description += ` — ${doc.thematiques.join(", ")}`;
		}
	} else if (doc.thematiques && doc.thematiques.length > 0) {
		description = doc.thematiques.join(", ");
	}

	const metadata = {
		title: title,
		description: description,
		alternates: { canonical: `/document/${slug}` },
		openGraph: {
			title: title,
			description: description,
			type: "article",
		},
	};

	if (doc.imageUrl) {
		metadata.openGraph.images = [{ url: doc.imageUrl }];
	}

	return metadata;
}

export default async function Page({ params }) {

	// Extract the slug from params
	const { slug } = await params

	return (
		<DocumentPage path={slug}></DocumentPage>
	)
}