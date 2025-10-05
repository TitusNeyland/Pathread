export default function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ ok: true });
  }
  return res.status(405).end();
}


