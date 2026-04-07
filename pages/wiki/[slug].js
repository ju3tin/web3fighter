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

// Dynamic routes: no pre-built paths, generate pages on-demand
export async function getStaticPaths() {
  return {
    paths: [],          // no pages pre-rendered
    fallback: 'blocking' // generate pages at request time
  };
}

// Fetch the markdown content for the requested slug
export async function getStaticProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/YourGitHubUsername/Web3-Fighter/${slug}.md`
    );

    if (!res.ok) {
      return { props: { notFound: true } };
    }

    const md = await res.text();
    const content = marked(md);

    return { props: { content } };
  } catch (err) {
    return { props: { notFound: true } };
  }
}