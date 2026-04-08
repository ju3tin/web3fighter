import React from 'react';
import Head from 'next/head';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'Web3Fighter Wiki' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Web3Fighter Wiki" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-950 text-gray-100">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                W
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Web3Fighter Wiki</h1>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="/" className="hover:text-blue-400 transition-colors">
                Home
              </a>
              <a href="/wiki" className="hover:text-blue-400 transition-colors">
                All Pages
              </a>
              <a 
                href="https://github.com/ju3tin/web3fighter" 
                target="_blank"
                className="hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8 mt-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p>
              Powered by GitHub • Data from{' '}
              <a 
                href="https://github.com/ju3tin/web3fighter" 
                target="_blank"
                className="hover:text-gray-300"
              >
                ju3tin/web3fighter
              </a>
            </p>
            <p className="mt-2">
              Built with Next.js • Updated in real-time from Markdown files
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}