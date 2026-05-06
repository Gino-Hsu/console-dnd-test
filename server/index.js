// server/index.js  —  json-server + custom /pages/:id endpoint
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ── Custom route: GET /pages/:id ──────────────────────────────────────────────
// Assembles a full PageGraph (layouts/slots/components as id-keyed objects)
// from the flat arrays stored in db.json, mirroring the TypeScript PageGraph type.
server.get('/pages/:id', (req, res) => {
    const db = router.db; // lowdb instance
    const pageId = req.params.id;

    const page = db.get('pages').find({ id: pageId }).value();
    if (!page) {
        return res.status(404).json({ error: 'Page not found' });
    }

    // Build id-keyed maps from flat arrays, stripping the `pageId` foreign key
    const layoutsArray = db.get('layouts').filter({ pageId }).value();
    const layouts = Object.fromEntries(
        layoutsArray.map(({ pageId: _pid, ...rest }) => [rest.id, rest]),
    );

    const allLayoutIds = new Set(layoutsArray.map(l => l.id));

    // Slots that belong to any layout on this page
    const slotsArray = db
        .get('slots')
        .filter(s => allLayoutIds.has(s.parentLayoutId))
        .value();
    const slots = Object.fromEntries(slotsArray.map(s => [s.id, s]));

    // Components that belong to any slot on this page
    const allSlotIds = new Set(slotsArray.map(s => s.id));
    const componentsArray = db
        .get('components')
        .filter(c => allSlotIds.has(c.parentSlotId))
        .value();
    const components = Object.fromEntries(componentsArray.map(c => [c.id, c]));

    return res.json({
        pageId: page.id,
        version: page.version,
        status: page.status,
        createdAt: page.createdAt,
        rootOrder: page.rootOrder,
        layouts,
        slots,
        components,
    });
});

// ── Custom route: PUT /pages/:id ──────────────────────────────────────────────
// Accepts a full PageGraph and rewrites all flat collections atomically.
server.put('/pages/:id', (req, res) => {
    const db = router.db;
    const pageId = req.params.id;
    const graph = req.body;

    if (!graph || !graph.layouts) {
        return res.status(400).json({ error: 'Invalid PageGraph body' });
    }

    // 1. Upsert page metadata
    const existing = db.get('pages').find({ id: pageId }).value();
    if (existing) {
        db.get('pages')
            .find({ id: pageId })
            .assign({
                version: graph.version,
                status: graph.status,
                createdAt: graph.createdAt,
                rootOrder: graph.rootOrder,
            })
            .write();
    } else {
        db.get('pages')
            .push({
                id: graph.pageId,
                version: graph.version,
                status: graph.status,
                createdAt: graph.createdAt,
                rootOrder: graph.rootOrder,
            })
            .write();
    }

    // 2. Replace layouts for this page
    const newLayouts = Object.values(graph.layouts).map(l => ({
        ...l,
        pageId,
    }));
    db.get('layouts').remove({ pageId }).write();
    newLayouts.forEach(l => db.get('layouts').push(l).write());

    // 3. Replace slots (by parentLayoutId membership)
    const newLayoutIdSet = new Set(newLayouts.map(l => l.id));
    db.get('slots')
        .remove(s => newLayoutIdSet.has(s.parentLayoutId))
        .write();
    Object.values(graph.slots).forEach(s => db.get('slots').push(s).write());

    // 4. Replace components (by parentSlotId membership)
    const newSlotIdSet = new Set(Object.keys(graph.slots));
    db.get('components')
        .remove(c => newSlotIdSet.has(c.parentSlotId))
        .write();
    Object.values(graph.components).forEach(c =>
        db.get('components').push(c).write(),
    );

    const stats = `layouts:${newLayouts.length} slots:${Object.keys(graph.slots).length} components:${Object.keys(graph.components).length}`;
    console.log(`[PUT /pages/${pageId}] saved — ${stats}`);
    return res.json({ ok: true, pageId });
});

// ── Default REST routes ───────────────────────────────────────────────────────
server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`\nJSON Server running on http://localhost:${PORT}`);
    console.log(
        `  GET http://localhost:${PORT}/pages/page-1  ← full PageGraph`,
    );
    console.log(
        `  PUT http://localhost:${PORT}/pages/page-1  ← publish PageGraph`,
    );
    console.log(`  GET http://localhost:${PORT}/layouts       ← flat array`);
    console.log(`  GET http://localhost:${PORT}/slots         ← flat array`);
    console.log(`  GET http://localhost:${PORT}/components    ← flat array\n`);
});
