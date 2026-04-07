import Layout from '../../components/Layout';
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
  // No pre-rendered paths
  return {
    paths: [],
    fallback: 'blocking', // generate pages on-demand
  };
}

export async function getStaticProps({ params }) {
  const slug = params?.slug;

  if (!slug) {
    return { props: { notFound: true } };
  }

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/YourGitHubUsername/Web3-Fighter/${slug}.md`
    );

    if (!res.ok) {
      return { props: { notFound: true } };
    }

    const md = await res.text();
    const content = marked(md);

    return {
      props: { content },
      revalidate: 60, // ISR: refresh page every 60 seconds
    };
  } catch (err) {
    return { props: { notFound: true } };
  }
}