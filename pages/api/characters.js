  // pages/api/characters.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    const characters = [
  { id: 'xiaoyu', name: 'Xiaoyu', portrait: '/characters/xiaoyu.png', model: '/models/black_girl_avatar.glb' },
  { id: 'julia', name: 'Julia', portrait: '/characters/julia.png', model: '/models/123.glb' },
  { id: 'ryu', name: 'Ryu', portrait: '/characters/ryu.png', model: '/models/ryu.glb' },
  { id: 'ken', name: 'Ken', portrait: '/characters/ken.png', model: '/models/ninja2.glb' },
  { id: 'chunli', name: 'Chun-Li', portrait: '/characters/ChunLi.png', model: '/models/chun_li.glb' },
  { id: 'guile', name: 'Guile', portrait: '/characters/Guile.png', model: '/models/urbanninja.glb' },
  { id: 'anna', name: 'Anna', portrait: '/characters/anna.png' },
  { id: 'blanka', name: 'Blanka', portrait: '/characters/Super_Blanka.png', model: '/models/fighter_action_2.glb' },
    ];
    
    res.status(200).json(characters);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
