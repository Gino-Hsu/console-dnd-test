// server/index.js  —  json-server + custom routes for PageGraph, editLogs, publishLogs
const jsonServer = require('json-server');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ── Helper: find latest page by pageId (highest version) ─────────────────────
function findLatestPage(db, pageId) {
    const all = db.get('pages').filter({ pageId }).value();
    if (!all.length) return null;
    return all.sort((a, b) => (b.version ?? 0) - (a.version ?? 0))[0];
}

// ── GET /pages/latest/:pageId ─────────────────────────────────────────────────
// Returns the latest published PageGraph (highest version).
server.get('/pages/latest/:pageId', (req, res) => {
    const db = router.db;
    const page = findLatestPage(db, req.params.pageId);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    return res.json(page);
});

// ── POST /pages/publish/:pageId ───────────────────────────────────────────────
// Publish: create a new page version, clear editLogs, append publishLog.
server.post('/pages/publish/:pageId', (req, res) => {
    const db = router.db;
    const { pageId } = req.params;
    const graph = req.body;

    if (!graph || !graph.layouts) {
        return res.status(400).json({ error: 'Invalid PageGraph body' });
    }

    const now = new Date().toISOString();
    const latest = findLatestPage(db, pageId);
    const newVersion = (latest?.version ?? 0) + 1;

    const pageDoc = {
        ...graph,
        pageId,
        version: newVersion,
        status: 'published',
        publishedAt: now,
    };

    db.get('pages').push(pageDoc).write();

    // Clear all editLogs for this page
    db.get('editLogs').remove({ pageId }).write();

    // Append publishLog
    const publishEntry = {
        id: uuidv4(),
        pageId,
        version: newVersion,
        publishedAt: now,
    };
    db.get('publishLogs').push(publishEntry).write();

    const layoutCount = Object.keys(graph.layouts || {}).length;
    const slotCount = Object.keys(graph.slots || {}).length;
    const compCount = Object.keys(graph.components || {}).length;
    console.log(
        `[POST /pages/publish/${pageId}] v${newVersion} — layouts:${layoutCount} slots:${slotCount} components:${compCount}`,
    );
    return res.json({ ok: true, pageId, version: newVersion });
});

// ── GET /editLogs/current/:pageId ─────────────────────────────────────────────
// Returns the latest editLog entry (by timestamp) for a page, or 404.
server.get('/editLogs/current/:pageId', (req, res) => {
    const db = router.db;
    const { pageId } = req.params;
    const logs = db.get('editLogs').filter({ pageId }).value();
    if (!logs.length)
        return res.status(404).json({ error: 'No edit log found' });
    const latest = logs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    )[0];
    return res.json(latest);
});

// ── POST /editLogs ────────────────────────────────────────────────────────────
// Append an editLog entry.
// Body: { pageId, action?, description?, graph }
server.post('/editLogs', (req, res) => {
    const db = router.db;
    const { pageId, action = 'edit', description = '', graph } = req.body;

    if (!pageId || !graph) {
        return res.status(400).json({ error: 'pageId and graph are required' });
    }

    const entry = {
        id: uuidv4(),
        pageId,
        action,
        description,
        timestamp: new Date().toISOString(),
        graph,
    };
    db.get('editLogs').push(entry).write();
    console.log(`[POST /editLogs] ${pageId} action=${action} id=${entry.id}`);
    return res.status(201).json({ ok: true, id: entry.id });
});

// ── Default REST routes ───────────────────────────────────────────────────────
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`\nJSON Server running on http://localhost:${PORT}`);
    console.log(`  GET  /pages/latest/:pageId       ← latest published page`);
    console.log(`  POST /pages/publish/:pageId      ← publish new version`);
    console.log(`  GET  /editLogs/current/:pageId   ← latest edit log`);
    console.log(`  POST /editLogs                   ← append edit step`);
    console.log(`  GET  /publishLogs?pageId=...     ← publish history\n`);
});
