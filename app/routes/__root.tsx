// app/routes/__root.tsx
import type { ReactNode } from 'react';

import {
    createRootRoute,
    HeadContent,
    Outlet,
    Scripts
} from '@tanstack/react-router';

import { Header } from '@/components/header';
import appCss from '@/styles/app.css?url';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                title: 'Deep Libras'
            },
            {
                name: 'description',
                content:
                    'Deep Libras is a platform to translate Libras to Portuguese.'
            }
        ],
        links: [
            {
                rel: 'stylesheet',
                href: appCss
            }
        ]
    }),
    component: RootComponent
});

function RootComponent() {
    return (
        <RootDocument>
            <Outlet />
        </RootDocument>
    );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head>
                <HeadContent />
            </head>

            <body className="bg-zinc-100/80">
                <Header />

                <main className="flex h-dvh w-dvw flex-col gap-2">
                    <div className="m-2 flex-1 rounded-xl bg-white p-4 pt-[80px]">
                        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                            {children}
                        </div>
                    </div>
                </main>

                <Scripts />
            </body>
        </html>
    );
}
