import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getScreener } from './TradingView-API-main/dist/data/index.js';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = '127.0.0.1';
const mime = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.json': 'application/json; charset=utf-8'
};

function sendJson(response, status, payload) {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer'
    });
    response.end(JSON.stringify(payload));
}

const server = createServer(async (request, response) => {
    const hostHeader = request.headers.host || '';
    if (!/^(localhost|127\.0\.0\.1):\d+$/.test(hostHeader)) {
        sendJson(response, 403, { error: 'Localhost access only.' });
        return;
    }

    const url = new URL(request.url || '/', `http://${host}:${port}`);
    if (request.method === 'GET' && url.pathname === '/api/quote') {
        const symbol = (url.searchParams.get('symbol') || '').trim();
        if (symbol.length > 64 || !/^[A-Za-z0-9._!/-]+:[A-Za-z0-9._!/-]+$/.test(symbol)) {
            sendJson(response, 400, { error: 'Use an exchange-qualified symbol, for example NASDAQ:AAPL.' });
            return;
        }
        try {
            const market = /^(NASDAQ|NYSE|AMEX|NYSEARCA|BATS):/i.test(symbol) ? 'america' : 'global';
            const result = await getScreener({
                market, symbols: [symbol], range: [0, 1],
                columns: [
                    'name', 'close', 'change', 'change_abs', 'volume', 'currency', 'market_cap_basic',
                    'earnings_per_share_basic_ttm', 'price_earnings_ttm', 'dividends_yield', 'beta_1_year',
                    'sector', 'industry'
                ]
            }, { signal: AbortSignal.timeout(15000) });
            const row = result.rows[0];
            if (!row) { sendJson(response, 404, { error: 'No market snapshot was found for that symbol.' }); return; }
            const values = row.values;
            const quote = {
                lp: values.close, ch: values.change_abs, chp: values.change, volume: values.volume,
                currency_code: values.currency, description: values.name, short_name: values.name,
                market_cap_basic: values.market_cap_basic, earnings_per_share_basic_ttm: values.earnings_per_share_basic_ttm,
                price_earnings_ttm: values.price_earnings_ttm, dividends_yield: values.dividends_yield,
                beta_1_year: values.beta_1_year, sector: values.sector, industry: values.industry
            };
            sendJson(response, 200, { symbol: row.symbol, quote });
        } catch (error) {
            sendJson(response, 502, { error: error?.message || 'The market quote request failed.' });
        }
        return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
    }

    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { response.writeHead(400); response.end(); return; }
    if (pathname === '/') pathname = '/index.html';
    const allowed = pathname === '/index.html' || pathname === '/script.js' || pathname === '/styles.css' || pathname.startsWith('/vendor/');
    if (!allowed || pathname.split('/').some(part => part.startsWith('.') && part !== '.')) {
        response.writeHead(404); response.end('Not found'); return;
    }
    const file = resolve(root, `.${pathname}`);
    const rootPrefix = root.endsWith(sep) ? root : root + sep;
    if (!file.startsWith(rootPrefix) && file !== resolve(root, 'index.html')) {
        response.writeHead(403); response.end('Forbidden'); return;
    }
    try {
        const content = await readFile(file);
        response.writeHead(200, {
            'Content-Type': mime[extname(file)] || 'application/octet-stream',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'no-referrer'
        });
        if (request.method === 'HEAD') response.end(); else response.end(content);
    } catch {
        response.writeHead(404); response.end('Not found');
    }
});

server.listen(port, host, () => {
    console.log(`CFA analytics is running at http://${host}:${port}`);
    console.log('Manual analysis is offline-capable. TradingView quotes are requested only when you click Load quote.');
});
