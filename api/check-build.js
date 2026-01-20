export default async function handler(req, res) {
  try {
    // On récupère la LISTE des releases au lieu de juste la "dernière"
    const response = await fetch('https://api.github.com/repos/mikefri/my-exe-factory/releases', {
      headers: { 
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const releases = await response.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      return res.status(200).json({ status: 'building', url: null });
    }

    // On parcourt les releases de la plus récente à la plus ancienne
    for (const release of releases) {
      const asset = release.assets.find(a => a.name.endsWith('.exe'));
      if (asset) {
        // Dès qu'on trouve un .exe, on le renvoie immédiatement !
        return res.status(200).json({ 
          status: 'success', 
          url: asset.browser_download_url 
        });
      }
    }

    return res.status(200).json({ status: 'building', url: null });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
