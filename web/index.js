import { join } from 'path';
import { readFileSync } from 'fs';
import express from 'express';
import serveStatic from 'serve-static';

import shopify from './shopify.js';
import webhooks from './webhooks.js';

import customersCartsService from './services/customersCarts.js';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
	process.env.NODE_ENV === 'production'
		? `${process.cwd()}/frontend/dist`
		: `${process.cwd()}/frontend/`;

const app = express();

app.use(express.json());

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
	shopify.config.auth.callbackPath,
	shopify.auth.callback(),
	shopify.redirectToShopifyOrAppRoot()
);
app.post(
	shopify.config.webhooks.path,
	// @ts-ignore
	shopify.processWebhooks({ webhookHandlers: webhooks })
);

app.get('/api', async (req, res) => {
	const { customer_id } = req.query;
	if (!customer_id) {
		return res.status(400).send(new Error('No customer_id provided in the request query params'));
	}

	try {
		const data = await customersCartsService.getCustomerCart(customer_id);
		return res.send(data);
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.post('/api', async (req, res) => {
	const { customer_id, variants } = req.body;
	if (!customer_id || !variants?.length) {
		return res
			.status(400)
			.send(new Error('Invalid request - Must provide a valid customer_id and variants'));
	}
	try {
		const data = await customersCartsService.createCustomerCart(
			customer_id,
			JSON.stringify(variants)
		);
		return res.send(data);
	} catch (err) {
		return res.status(500).send(err);
	}
});

// All endpoints after this point will require an active session
app.use('/api/*', shopify.validateAuthenticatedSession());

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use('/*', shopify.ensureInstalledOnShop(), async (_req, res) => {
	return res.set('Content-Type', 'text/html').send(readFileSync(join(STATIC_PATH, 'index.html')));
});

app.listen(PORT);
