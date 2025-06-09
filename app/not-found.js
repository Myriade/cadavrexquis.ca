import Link from 'next/link';

export default function NotFound() {
	return (
		<main className="text-center grid absolute inset-0 content-center justify-center">
			<h1 className="text-base uppercase mb-4">erreur 404</h1>
			<p className="text-3xl text-muted-foreground mb-6">
				Page non trouvée
			</p>
			<Link 
				href="/" 
				className="button"
			>
				Accueil
			</Link>
		</main>
	)
}