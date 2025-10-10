import '../styles/globals.css';
import { HeadTitleProvider, HeadTitle } from "../components/head-title/provider";
import { TempProtectLayout } from '../components/tempProtectLayout'
import { Footer } from '../components/footer';
import { Header } from '../components/header';

export const metadata = {
  title: {
    default: 'Cadavre exquis'
  }
};

export default function RootLayout({ children }) {
  return (
    <HeadTitleProvider>
      <html lang="fr">
        <head>
          <HeadTitle />
          <link rel="icon" href="/favicon.png" sizes="any" />
        </head>
        
        <body className="antialiased">
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
        </body>
      </html>
    </HeadTitleProvider>
  );
}
