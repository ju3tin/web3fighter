  // pages/api/characters.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    const characters = [
  { id: 'xiaoyu', name: 'Xiaoyu', portrait: '/characters/xiaoyu.png' },
  { id: 'julia', name: 'Julia', portrait: '/characters/julia.png' },
  { id: 'ryu', name: 'Ryu', portrait: '/characters/ryu.png' },
  { id: 'ken', name: 'Ken', portrait: '/characters/ken.png', model: '/models/ninja2.glb' },
  { id: 'chunli', name: 'Chun-Li', portrait: '/characters/ChunLi.png', model: '/models/chun_li.glb' },
  { id: 'guile', name: 'Guile', portrait: '/characters/Guile.png' },
  { id: 'anna', name: 'Anna', portrait: '/characters/anna.png' },
  { id: 'blanka', name: 'Blanka', portrait: '/characters/Super_Blanka.png' },
    ];
    
    res.status(200).json(characters);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
