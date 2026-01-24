export default async function handler(req, res) {
  try {
    // 1. On vérifie d'abord l'état du dernier build dans GitHub Actions
    const runsRes = await fetch('https://api.github.com/repos/mikefri/my-exe-factory/actions/runs?per_page=1', {
      headers: { 
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    const runsData = await runsRes.json();
    const latestRun = runsData.workflow_runs[0];

    // Si un build est en cours (status n'est pas 'completed'), on dit au site d'attendre
    if (latestRun && latestRun.status !== 'completed') {
      return res.status(200).json({ status: 'building', url: null });
    }

    // 2. Seulement si le build est fini, on cherche l'exécutable dans les releases
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

    // On cherche le .exe dans la release la plus récente
    const latestRelease = releases[0];
    const asset = latestRelease.assets.find(a => a.name.endsWith('.exe'));

    if (asset) {
      return res.status(200).json({ 
        status: 'success', 
        url: asset.browser_download_url 
      });
    }

    return res.status(200).json({ status: 'building', url: null });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
