import { Link } from '@tanstack/react-router';

export function Header() {
    return (
        <header className="fixed top-0 right-0 left-0 z-50 mx-auto mt-4 flex w-[calc(100%-64px)] max-w-7xl items-center justify-between rounded-xl border-b border-white/40 bg-white/70 p-2 pl-4 shadow-md backdrop-blur-md">
            <h1 className="text-2xl">
                <Link to="/" className="flex items-center gap-0.5">
                    <span className="font-inter font-light">Deep</span>

                    <span className="font-instrument tracking-wide italic">
                        Libras
                    </span>
                </Link>
            </h1>

            <nav className="flex gap-3">
                <Link
                    to="/train"
                    className="rounded-lg p-1 px-2 transition-all hover:bg-green-500/30"
                >
                    Treinar modelo
                </Link>

                <Link
                    to="/"
                    className="rounded-lg bg-green-500 px-3 py-1 text-white shadow-lg transition-all hover:scale-103"
                >
                    Traduzir{' '}
                    <span className="font-instrument tracking-wider italic">
                        Libras
                    </span>
                </Link>
            </nav>
        </header>
    );
}
