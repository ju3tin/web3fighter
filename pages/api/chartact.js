export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query; // <-- get id from URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    const [charactersRes, movesRes] = await Promise.all([
      fetch(`${baseUrl}/api/characters`),
      fetch(`${baseUrl}/api/moveslist`),
    ]);

    if (!charactersRes.ok || !movesRes.ok) {
      throw new Error('One of the internal fetches failed');
    }

    const characters = await charactersRes.json();
    const movesData = await movesRes.json();

    // Find ONE character
    const char = characters.find(c => String(c.id) === String(id));

    if (!char) {
      return res.status(404).json({ error: 'Character not found' });
    }

    const moveEntry = movesData.find(m => m.id === char.id);

    const combined = {
      ...char,
      movelist: moveEntry?.movelist || [],
    };

    return res.status(200).json(combined);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Failed to combine data',
      message: err.message,
    });
  }
}
