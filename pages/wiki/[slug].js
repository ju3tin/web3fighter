import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { marked } from 'marked';

export default function WikiPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [content, setContent] = useState('Loading...');

  useEffect(() => {
    if (!slug) return;

    const fetchMarkdown = async () => {
      try {
        const res = await fetch(
          `https://raw.githubusercontent.com/wiki/YourGitHubUsername/Web3-Fighter/${slug}.md`
        );
        if (!res.ok) throw new Error('Page not found');
        const md = await res.text();
        setContent(marked(md));
      } catch (err) {
        setContent('Page not found.');
      }
    };

    fetchMarkdown();
  }, [slug]);

  return (
    <Layout>
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </Layout>
  );
}
