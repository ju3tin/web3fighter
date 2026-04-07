import Layout from '@/components/Layout';
import { marked } from 'marked';

export default function WikiPage({ content, notFound }) {
  if (notFound) {
    return (
      <Layout>
        <h1>Page not found.</h1>
      </Layout>
    );
  }

  return (
    <Layout>
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  if (!params || !params.slug || typeof params.slug !== 'string') {
    return { props: { notFound: true } };
  }

  const slug = params.slug.trim().replace(/^\/+|\/+$/g, '');

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/ju3tin/web3fighter/${slug}.md`
    );

    if (!res.ok) {
      return { props: { notFound: true } };
    }

    const md = await res.text();
    const content = marked(md);

    return {
      props: { content },
      revalidate: 60,
    };
  } catch (err) {
    return { props: { notFound: true } };
  }
}