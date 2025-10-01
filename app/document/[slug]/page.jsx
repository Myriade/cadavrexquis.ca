import { DocumentPage } from '../../../components/documentPage';

export default async function Page({ params }) {
	
	// Extract the slug from params
	const { slug } = await params
	
	return (
		<DocumentPage path={slug}></DocumentPage>
	)
}