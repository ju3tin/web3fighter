import Layout from '@/components/Layout';
import { marked } from 'marked';
import { useRouter } from 'next/router';

export default function WikiPage({ content, notFound, slug }) {
  const router = useRouter();

  // Show loading state during fallback rendering
  if (router.isFallback) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading wiki page...</h2>
        </div>
      </Layout>
    );
  }

  if (notFound || !content) {
    return (
      <Layout>
        <h1>Page not found.</h1>
        <p>The wiki page you are looking for does not exist or could not be loaded.</p>
        <p>Slug attempted: <code>{slug || 'unknown'}</code></p>
      </Layout>
    );
  }

  return (
    <Layout>
      <article
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      />
    </Layout>
  );
}

// Generate paths (empty = generate on demand)
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',   // Recommended for wiki-style sites
    // You can change to `true` if you prefer a loading state without blocking
  };
}

// Fetch markdown from GitHub
export async function getStaticProps({ params }) {
  // Critical safety check to prevent destructuring errors
  if (!params || !params.slug || typeof params.slug !== 'string') {
    return {
      props: {
        notFound: true,
        slug: null,
      },
    };
  }

  const rawSlug = params.slug.toString().trim().replace(/^\/+|\/+$/g, '');

  // Prevent empty slug after cleaning
  if (!rawSlug) {
    return {
      props: {
        notFound: true,
        slug: null,
      },
    };
  }

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/ju3tin/web3fighter/${rawSlug}.md`,
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );

    if (!res.ok) {
      return {
        props: {
          notFound: true,
          slug: rawSlug,
        },
      };
    }

    const md = await res.text();

    // Convert markdown to HTML
    const content = marked.parse(md);   // Use marked.parse() in newer versions

    return {
      props: {
        content,
        notFound: false,
        slug: rawSlug,
      },
      revalidate: 60,   // Re-generate page every 60 seconds
    };
  } catch (err) {
    console.error(`Error fetching wiki page ${rawSlug}:`, err);

    return {
      props: {
        notFound: true,
        slug: rawSlug,
      },
    };
  }
}