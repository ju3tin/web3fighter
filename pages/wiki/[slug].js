import fs from 'fs';
import path from 'path';
import Layout from '@/components/Layout';
import { marked } from 'marked';

const CACHE_DIR = path.join(process.cwd(), 'wiki-cache');
const REVALIDATE_SECONDS = 60; // re-fetch every 60 seconds

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR);
}

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
  // No pre-rendered pages, generate on-demand
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  const params = context?.params;

  if (!params || !params.slug) {
    return { props: { notFound: true } };
  }

  const { slug } = params;
  const cacheFile = path.join(CACHE_DIR, `${slug}.html`);

  let content;

  // Check if cached file exists
  if (fs.existsSync(cacheFile)) {
    const stats = fs.statSync(cacheFile);
    const ageSeconds = (Date.now() - stats.mtimeMs) / 1000;

    content = fs.readFileSync(cacheFile, 'utf-8');

    // If cache is fresh enough, return it
    if (ageSeconds < REVALIDATE_SECONDS) {
      return { props: { content } };
    }
    // Otherwise, continue to fetch fresh content
  }

  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/wiki/YourGitHubUsername/Web3-Fighter/${slug}.md`
    );

    if (!res.ok) {
      return { props: { notFound: true } };
    }

    const md = await res.text();
    content = marked(md);

    // Save content to cache
    fs.writeFileSync(cacheFile, content, 'utf-8');

    return { props: { content } };
  } catch (err) {
    return { props: { notFound: true } };
  }
}