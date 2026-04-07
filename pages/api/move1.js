// pages/api/movelist.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Set the path to your JSON file
    const filePath = path.join(process.cwd(), 'data', 'moves.json');

    // Check if the file exists and send the content
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).json({ error: 'Failed to load moves data' });
        return;
      }

      // Send the parsed JSON data in the response
      res.status(200).json(JSON.parse(data));
    });
  } else {
    // Handle other HTTP methods (like POST, PUT, etc.)
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
