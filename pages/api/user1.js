// pages/api/user1.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];
    
    res.status(200).json(users);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
