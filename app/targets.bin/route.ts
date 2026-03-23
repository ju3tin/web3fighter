export async function GET() {
    const res = await fetch(
      'https://agkdcogqyas1ua0y.public.blob.vercel-storage.com/makehuman-data/public/targets/targets.bin'
    );
  
    return new Response(res.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'inline; filename="targets.bin"',
      },
    });
  }