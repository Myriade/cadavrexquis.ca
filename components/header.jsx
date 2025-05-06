import Image from 'next/image';
import Link from 'next/link';
import tempLogo from 'public/images/cadavre-exquis-logo.svg';

const navItems = [
    //{ linkText: 'À propos', href: '/a-propos' },
];

export function Header() {
    return (<>
        <nav className="flex flex-wrap justify-between items-center gap-4 pt-6 pb-10">
            <p>
                <i>[menu]</i>
            </p>
            <Link href="/">
                <Image src={tempLogo} alt="Cadavre exquis" className="w-40"/>
            </Link>
            <p>
                <i>[loupe]</i>
            </p>
        </nav>
        
        <nav className='hidden'>
            {!!navItems?.length && (
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="inline-block px-1.5 py-1 transition hover:opacity-80 sm:px-3 sm:py-2"
                            >
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    </>);
}
