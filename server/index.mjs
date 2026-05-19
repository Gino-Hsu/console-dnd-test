// json-server + custom routes
// architecture:
// pages       = stable snapshots
// editLogs    = operation logs
// publishLogs = publish history

import jsonServer from 'json-server';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();

const router = jsonServer.router(path.join(__dirname, 'db.json'));

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// ─────────────────────────────────────
// Helpers
// ─────────────────────────────────────

function getPages(db, pageId) {
    return db.get('pages').filter({ pageId }).value();
}

function findLatestPage(db, pageId) {
    const pages = getPages(db, pageId);

    if (!pages.length) return null;

    return pages.sort((a, b) => b.version - a.version)[0];
}

function findPublishedPage(db, pageId) {
    const allPages = db.get('pages').value();
    console.log(
        `[debug] findPublishedPage for ${pageId}, all pages:`,
        allPages.map(p => ({ pageId: p.pageId, status: p.status })),
    );
    const found =
        db.get('pages').find({ pageId, status: 'published' }).value() ?? null;
    console.log(`[debug] found:`, found ? 'yes' : 'no');
    return found;
}

function getEditLogs(db, pageId) {
    return db.get('editLogs').filter({ pageId }).sortBy('createdAt').value();
}

// ─────────────────────────────────────
// GET /pages/latest/:pageId
// latest version
// ─────────────────────────────────────

server.get('/pages/latest/:pageId', (req, res) => {
    const db = router.db;

    const page = findLatestPage(db, req.params.pageId);

    if (!page) {
        return res.status(404).json({
            error: 'Page not found',
        });
    }

    return res.json(page);
});

// ─────────────────────────────────────
// GET /pages/published/:pageId
// current published page
// ─────────────────────────────────────

server.get('/pages/published/:pageId', (req, res) => {
    const db = router.db;

    const page = findPublishedPage(db, req.params.pageId);

    if (!page) {
        return res.status(404).json({
            error: 'Published page not found',
        });
    }

    return res.json(page);
});

// ─────────────────────────────────────
// GET /pages/current/:pageId
// published snapshot + editLogs
// ─────────────────────────────────────

server.get('/pages/current/:pageId', (req, res) => {
    const db = router.db;

    const { pageId } = req.params;

    const published = findPublishedPage(db, pageId);

    if (!published) {
        return res.status(404).json({
            error: 'Published page not found',
        });
    }

    const editLogs = getEditLogs(db, pageId);

    return res.json({
        base: published,
        editLogs,
    });
});

// ─────────────────────────────────────
// POST /pages/publish/:pageId
// create new published version
// ─────────────────────────────────────

server.post('/pages/publish/:pageId', (req, res) => {
    const db = router.db;

    const { pageId } = req.params;

    const graph = req.body;

    if (!graph || !graph.layouts) {
        return res.status(400).json({
            error: 'Invalid PageGraph body',
        });
    }

    const now = new Date().toISOString();

    const latest = findLatestPage(db, pageId);

    const newVersion = (latest?.version ?? 0) + 1;

    // archive old published pages
    db.get('pages')
        .filter({ pageId, status: 'published' })
        .forEach(page => {
            page.status = 'archived';
        })
        .write();

    const newPage = {
        id: uuidv4(),
        pageId,
        version: newVersion,
        status: 'published',
        createdAt: now,
        publishedAt: now,
        rootOrder: graph.rootOrder,
        layouts: graph.layouts,
        slots: graph.slots,
        modules: graph.modules,
    };

    db.get('pages').push(newPage).write();

    // clear edit logs after publish
    db.get('editLogs').remove({ pageId }).write();

    // publish history
    db.get('publishLogs')
        .push({
            id: uuidv4(),
            pageId,
            version: newVersion,
            publishedAt: now,
        })
        .write();

    console.log(`[publish] ${pageId} v${newVersion}`);

    return res.json({
        ok: true,
        version: newVersion,
    });
});

// ─────────────────────────────────────
// GET /editLogs/:pageId
// operation logs
// ─────────────────────────────────────

server.get('/editLogs/:pageId', (req, res) => {
    const db = router.db;

    const logs = getEditLogs(db, req.params.pageId);

    return res.json(logs);
});

// ─────────────────────────────────────
// POST /editLogs
// append operation log
// ─────────────────────────────────────

server.post('/editLogs', (req, res) => {
    const db = router.db;

    const { pageId, type, label = '', payload = {} } = req.body;

    if (!pageId || !type) {
        return res.status(400).json({
            error: 'pageId and type are required',
        });
    }

    const entry = {
        id: uuidv4(),
        pageId,
        type,
        label,
        payload,
        createdAt: new Date().toISOString(),
    };

    db.get('editLogs').push(entry).write();

    console.log(`[editLog] ${pageId} ${type}`);

    return res.status(201).json({
        ok: true,
        id: entry.id,
    });
});

// ─────────────────────────────────────
// DELETE /editLogs/:pageId
// clear draft operations
// ─────────────────────────────────────

server.delete('/editLogs/:pageId', (req, res) => {
    const db = router.db;

    db.get('editLogs').remove({ pageId: req.params.pageId }).write();

    return res.json({
        ok: true,
    });
});

// ─────────────────────────────────────
// default routes
// ─────────────────────────────────────

server.use(router);

// ─────────────────────────────────────
// start
// ─────────────────────────────────────

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(``);
    console.log(`JSON Server running`);
    console.log(`http://localhost:${PORT}`);
    console.log(``);
    console.log(`GET    /pages/latest/:pageId`);
    console.log(`GET    /pages/published/:pageId`);
    console.log(`GET    /pages/current/:pageId`);
    console.log(`POST   /pages/publish/:pageId`);
    console.log(``);
    console.log(`GET    /editLogs/:pageId`);
    console.log(`POST   /editLogs`);
    console.log(`DELETE /editLogs/:pageId`);
    console.log(``);
});
