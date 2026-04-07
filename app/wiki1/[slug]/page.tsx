import Layout from '@/components/Layout';
import { marked } from 'marked';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate static params (optional - you can leave it empty for on-demand generation)
export async function generateStaticParams() {
  return [];
}

// Main Page Component
export default async function WikiPage({ params }: Props) {
  const { slug } = await params;

  // Safety check
  if (!slug || typeof slug !== 'string') {
    notFound();
  }

  const rawSlug = slug.toString().trim().replace(/^\/+|\/+$/g, '');

  if (!rawSlug) {
    notFound();
  }

  let content: string;
  let pageTitle = rawSlug;

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/ju3tin/web3fighter/${rawSlug}.md`,
      {
        next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      notFound();
    }

    const md = await res.text();
    content = await marked.parse(md);
  } catch (error) {
    console.error(`Failed to fetch wiki page: ${rawSlug}`, error);
    notFound();
  }

  return (
    <Layout params={{ slug: rawSlug }}>
      <article
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
        }}
      />
    </Layout>
  );
}

// Optional: Metadata generation
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const rawSlug = slug.toString().trim().replace(/^\/+|\/+$/g, '');

  return {
    title: rawSlug ? `${rawSlug} - Wiki` : 'Wiki',
    description: `Reading wiki page: ${rawSlug}`,
  };
}