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

// Define all possible slugs at build time
export async function getStaticPaths() {
  // Example: fetch a list of slugs from GitHub
  const res = await fetch(
    'https://api.github.com/repos/YourGitHubUsername/Web3-Fighter/pages'
  );
  const pages = await res.json();

  const paths = pages.map((page) => ({
    params: { slug: page.name.replace('.md', '') },
  }));

  return { paths, fallback: false }; // only pre-render listed pages
}

// Fetch content for each slug at build time
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