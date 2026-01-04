// pages/api/user1.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    const characters = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 'ryu', name: 'Ryu', portrait: '/characters/ryu.png' },
  { id: 'ken', name: 'Ken', portrait: '/characters/ken.png' },
  { id: 'chunli', name: 'Chun-Li', portrait: '/characters/ChunLi.png' },
  { id: 'guile', name: 'Guile', portrait: '/characters/Guile.png' },
  { id: 'zangief', name: 'Zangief', portrait: '/characters/Super_Zangief.png' },
  { id: 'blanka', name: 'Blanka', portrait: '/characters/Super_Blanka.png' },
    ];
    
    res.status(200).json(characters);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
