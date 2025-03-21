import Link from 'next/link';

const navItems = [
    { linkText: 'À propos', href: '/a-propos' },
    { linkText: 'Code d’éthique du réemploi', href: 'code-ethique'}
];

export function Footer() {
    return (
        <footer className="pt-16 pb-12 sm:pt-24 sm:pb-16">
            {!!navItems?.length && (
                <ul className="grid gap-1">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.href}
                                className="inline-block px-1.5 transition hover:opacity-80 sm:px-3"
                            >
                                {item.linkText}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </footer>
    );
};
