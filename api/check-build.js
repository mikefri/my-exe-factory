export default async function handler(req, res) {
  try {
    // On demande à GitHub quelle est la toute dernière release
    const response = await fetch(`https://api.github.com/repos/mikefri/my-exe-factory/releases/latest`, {
      headers: { 
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    const data = await response.json();

    // On cherche un fichier qui finit par .exe dans les fichiers de la release
    const asset = data.assets ? data.assets.find(a => a.name.endsWith('.exe')) : null;

    if (asset) {
      // Si on le trouve, on renvoie l'adresse de téléchargement
      return res.status(200).json({ url: asset.browser_download_url });
    } else {
      // Sinon, on dit au site de continuer à attendre
      return res.status(200).json({ url: null });
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
