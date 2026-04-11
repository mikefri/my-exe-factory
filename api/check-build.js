export default async function handler(req, res) {
  try {
    const headers = {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    };

    const runsRes = await fetch(
      'https://api.github.com/repos/mikefri/my-exe-factory/actions/runs?per_page=1',
      { headers }
    );

    if (!runsRes.ok) {
      const err = await runsRes.text();
      return res.status(500).json({ error: `GitHub runs API: ${runsRes.status} - ${err}` });
    }

    const runsData = await runsRes.json();
    const runs = runsData.workflow_runs;

    if (!runs || runs.length === 0) {
      return res.status(200).json({ status: 'building', url: null });
    }

    const latestRun = runs[0];

    if (latestRun.status !== 'completed') {
      return res.status(200).json({ status: 'building', url: null });
    }

    // Build terminé → chercher le .exe
    const relRes = await fetch(
      'https://api.github.com/repos/mikefri/my-exe-factory/releases',
      { headers }
    );

    if (!relRes.ok) {
      return res.status(200).json({ status: 'building', url: null });
    }

    const releases = await relRes.json();

    if (!Array.isArray(releases) || releases.length === 0) {
      return res.status(200).json({ status: 'building', url: null });
    }

    const asset = releases[0].assets.find(a => a.name.endsWith('.exe'));

    if (asset) {
      return res.status(200).json({ status: 'success', url: asset.browser_download_url });
    }

    return res.status(200).json({ status: 'building', url: null });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
