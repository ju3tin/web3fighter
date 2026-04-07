// app/wiki/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import Layout from '@/components/Layout';

interface WikiPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  // Optional: pre-render all wiki pages if you have a local copy
  // Return type: { slug: string }[]
  // Example uses local folder, can skip if fetching from GitHub
  return [];
}

export default async function WikiPage({ params }: WikiPageProps) {
  const { slug } = params;

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/YourGitHubUsername/Web3-Fighter/${slug}.md`
    );

    if (!res.ok) {
      return notFound(); // Throws 404 page
    }

    const md = await res.text();
    const content = marked(md);

    return (
      <Layout params={params}>
        <article dangerouslySetInnerHTML={{ __html: content }} />
      </Layout>
    );
  } catch (err) {
    return (
      <Layout params={params}>
        <p>Page not found.</p>
      </Layout>
    );
  }
}
