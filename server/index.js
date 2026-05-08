// server/index.js  —  json-server + custom routes for PageGraph, drafts, editLogs
const jsonServer = require('json-server');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ── Helper: find page by pageId ───────────────────────────────────────────────
function findPage(db, pageId) {
    return db.get('pages').find({ pageId }).value();
}

// ── GET /pages/:id ────────────────────────────────────────────────────────────
// Returns the full published PageGraph (layouts/slots/components as id-keyed objects).
server.get('/pages/:id', (req, res) => {
    const db = router.db;
    const page = findPage(db, req.params.id);
    if (!page) return res.status(404).json({ error: 'Page not found' });
    return res.json(page);
});

// ── PUT /pages/:id ────────────────────────────────────────────────────────────
// Publish: replace the page record with the incoming PageGraph.
// Also appends an editLog entry with action='publish'.
server.put('/pages/:id', (req, res) => {
    const db = router.db;
    const pageId = req.params.id;
    const graph = req.body;

    if (!graph || !graph.layouts) {
        return res.status(400).json({ error: 'Invalid PageGraph body' });
    }

    const existing = findPage(db, pageId);
    const now = new Date().toISOString();
    const pageDoc = { ...graph, pageId, status: 'published', createdAt: now };

    if (existing) {
        db.get('pages').find({ pageId }).assign(pageDoc).write();
    } else {
        db.get('pages').push(pageDoc).write();
    }

    // Append publish log
    db.get('editLogs')
        .push({
            id: uuidv4(),
            pageId,
            draftId: null,
            action: 'publish',
            description: '發布頁面',
            timestamp: now,
            payload: {},
        })
        .write();

    const layoutCount = Object.keys(graph.layouts || {}).length;
    const slotCount = Object.keys(graph.slots || {}).length;
    const compCount = Object.keys(graph.components || {}).length;
    console.log(
        `[PUT /pages/${pageId}] published — layouts:${layoutCount} slots:${slotCount} components:${compCount}`,
    );
    return res.json({ ok: true, pageId });
});

// ── GET /drafts/:pageId ───────────────────────────────────────────────────────
// Returns the current draft for a page (latest by updatedAt), or 404.
server.get('/drafts/:pageId', (req, res) => {
    const db = router.db;
    const { pageId } = req.params;
    const drafts = db.get('drafts').filter({ pageId }).value();
    if (!drafts.length)
        return res.status(404).json({ error: 'No draft found' });
    // Return the most recently updated draft
    const latest = drafts.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
    )[0];
    return res.json(latest);
});

// ── PUT /drafts/:pageId ───────────────────────────────────────────────────────
// Save (upsert) a draft for a page. Creates one if it doesn't exist.
server.put('/drafts/:pageId', (req, res) => {
    const db = router.db;
    const { pageId } = req.params;
    const graph = req.body;

    if (!graph || !graph.layouts) {
        return res.status(400).json({ error: 'Invalid PageGraph body' });
    }

    const now = new Date().toISOString();
    const existing = db.get('drafts').find({ pageId }).value();

    if (existing) {
        db.get('drafts')
            .find({ pageId })
            .assign({ ...graph, pageId, status: 'draft', updatedAt: now })
            .write();
    } else {
        db.get('drafts')
            .push({
                ...graph,
                pageId,
                draftId: uuidv4(),
                status: 'draft',
                createdAt: now,
                updatedAt: now,
            })
            .write();
    }

    const draft = db.get('drafts').find({ pageId }).value();
    console.log(`[PUT /drafts/${pageId}] saved draft ${draft.draftId}`);
    return res.json({ ok: true, pageId, draftId: draft.draftId });
});

// ── DELETE /drafts/:pageId ────────────────────────────────────────────────────
// Discard the draft for a page.
server.delete('/drafts/:pageId', (req, res) => {
    const db = router.db;
    const { pageId } = req.params;
    db.get('drafts').remove({ pageId }).write();
    console.log(`[DELETE /drafts/${pageId}] draft discarded`);
    return res.json({ ok: true, pageId });
});

// ── POST /editLogs ────────────────────────────────────────────────────────────
// Append an edit-log entry.
// Body: { pageId, draftId?, action, description?, payload? }
server.post('/editLogs', (req, res) => {
    const db = router.db;
    const {
        pageId,
        draftId = null,
        action,
        description = '',
        payload = {},
    } = req.body;

    if (!pageId || !action) {
        return res
            .status(400)
            .json({ error: 'pageId and action are required' });
    }

    const entry = {
        id: uuidv4(),
        pageId,
        draftId,
        action,
        description,
        timestamp: new Date().toISOString(),
        payload,
    };
    db.get('editLogs').push(entry).write();
    return res.status(201).json(entry);
});

// ── GET /editLogs?pageId=:pageId ─────────────────────────────────────────────
// Query logs for a page (handled by json-server default filter + custom route).

// ── Default REST routes ───────────────────────────────────────────────────────
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`\nJSON Server running on http://localhost:${PORT}`);
    console.log(
        `  GET    http://localhost:${PORT}/pages/page-1      ← published PageGraph`,
    );
    console.log(
        `  PUT    http://localhost:${PORT}/pages/page-1      ← publish PageGraph`,
    );
    console.log(
        `  GET    http://localhost:${PORT}/drafts/page-1     ← current draft`,
    );
    console.log(
        `  PUT    http://localhost:${PORT}/drafts/page-1     ← save draft`,
    );
    console.log(
        `  DELETE http://localhost:${PORT}/drafts/page-1     ← discard draft`,
    );
    console.log(
        `  POST   http://localhost:${PORT}/editLogs          ← append log`,
    );
    console.log(
        `  GET    http://localhost:${PORT}/editLogs?pageId=page-1  ← query logs\n`,
    );
});
