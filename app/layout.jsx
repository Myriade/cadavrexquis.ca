import '../styles/globals.css';
import { HeadTitleProvider, HeadTitle } from "../components/head-title/provider";
import { TempProtectLayout } from '../components/tempProtectLayout'
import { Footer } from '../components/footer';
import { Header } from '../components/header';

import { Suspense } from "react";
import { MatomoAnalytics } from "./matomo";

export const metadata = {
  title: {
    default: 'Cadavre exquis'
  }
};

/* // Note sur un bogue d'hydratation et le composant TempProtectLayout //
Le composant de protection temporaire par mot de passe est laissé volontairement même en prod
On y a retiré les fonctionnalités de prompt pour verification de mot de passe
Il inclue un useEffect qui prévient un bogue d'hydratation React.
Le bogue demanderait un refactor de tous les appels à localStorage, date(now) et typeof window !== 'undefined')
Semble-t-il que l'appel d'un premier useEffect avant tout rendu html, comme le fait TempProtectLayout dans sa plus simple expression, prévient le bogue d'hydratation React.
https://nextjs.org/docs/messages/react-hydration-error
*/

export default function RootLayout({ children }) {
  return (
    <HeadTitleProvider>
      <html lang="fr">
        <head>
          <HeadTitle />
          <link rel="icon" href="/favicon.png" sizes="any" />
        </head>
        
        <body className="antialiased">
          <Suspense fallback={null}>
            <MatomoAnalytics />
            <TempProtectLayout>
              <div className="flex flex-col min-h-screen px-6 bg-grid-pattern sm:px-12">
                <div className="flex flex-col w-full max-w-7xl mx-auto grow">
                  <Header />
                  <div className="grow relative">
                    {children}
                  </div>
                  <Footer />
                </div>
              </div>
            </TempProtectLayout>
          </Suspense>
        </body>
      </html>
    </HeadTitleProvider>
  );
}
