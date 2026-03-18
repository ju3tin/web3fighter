// e.g. app/api/characters-with-moves/route.js   ← App Router example
// or pages/api/characters-with-moves.js          ← Pages Router

export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
    try {
      // Fetch both in parallel (faster)
      const [charactersRes, movesRes] = await Promise.all([
        fetch(`${baseUrl}/api/characters`),     // adjust endpoint name if different
        fetch(`${baseUrl}/api/moveslist`),      // adjust if your moves endpoint has different name
      ]);
  
      if (!charactersRes.ok || !movesRes.ok) {
        throw new Error('One of the internal fetches failed');
      }
  
      const characters = await charactersRes.json();
      const movesData = await movesRes.json();   // array of { id, movelist }
  
      // Merge
      const combined = characters.map(char => {
        const moveEntry = movesData.find(m => m.id === char.id);
        return {
          ...char,
          movelist: moveEntry?.movelist || [],   // use movelist (or moveslist — pick one)
        };
      });
  
      return res.status(200).json(combined);
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: 'Failed to combine data',
        message: err.message,
      });
    }
  }