export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { zip_url } = req.body;

  // C'est ici qu'on parle à GitHub
  const githubRes = await fetch('https://api.github.com/repos/TON_NOM_GITHUB/TON_DEPOT/actions/workflows/build.yml/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`, // On utilise une variable d'environnement
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ref: 'main',
      inputs: { zip_url: zip_url }
    })
  });

  if (githubRes.ok) {
    return res.status(200).json({ success: true });
  } else {
    const error = await githubRes.text();
    return res.status(500).json({ error });
  }
}
