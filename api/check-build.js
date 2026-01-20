export default async function handler(req, res) {
  try {
    // 1. Appel à l'API GitHub pour récupérer la dernière version créée
    const response = await fetch('https://api.github.com/repos/mikefri/my-exe-factory/releases/latest', {
      headers: { 
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    // Si GitHub répond 404, c'est qu'aucune release n'a encore été créée
    if (response.status === 404) {
      return res.status(200).json({ status: 'building', url: null });
    }

    const data = await response.json();

    // 2. On cherche le fichier .exe dans les "assets" de la release
    const asset = data.assets ? data.assets.find(a => a.name.endsWith('.exe')) : null;

    if (asset) {
      // VICTOIRE : Le fichier est prêt, on envoie l'URL au bouton de téléchargement
      return res.status(200).json({ 
        status: 'success', 
        url: asset.browser_download_url 
      });
    } else {
      // EN COURS : La release existe peut-être mais le fichier .exe n'est pas encore uploadé
      return res.status(200).json({ 
        status: 'building', 
        url: null 
      });
    }
  } catch (e) {
    // ERREUR : Problème de connexion ou de code
    return res.status(500).json({ error: e.message });
  }
}
