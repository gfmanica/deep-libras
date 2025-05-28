import { Link } from '@tanstack/react-router';

import { Button } from './ui/button';

export function Header() {
    return (
        <header className="flex p-2">
            <h1 className="absolute left-4 text-2xl font-bold">
                <Link to="/">DeepLibras</Link>
            </h1>

            <nav className="flex flex-1 items-center justify-center gap-4">
                <Button
                    variant="ghost"
                    className="[&>[data-status='active']]:text-blue-500"
                >
                    <Link to="/">Traduzir Libras</Link>
                </Button>

                <Button
                    variant="ghost"
                    className="[&>[data-status='active']]:text-blue-500"
                >
                    <Link to="/train">Treinar modelo</Link>
                </Button>
            </nav>
        </header>
    );
}
