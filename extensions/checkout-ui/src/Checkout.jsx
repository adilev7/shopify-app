import { useState, useEffect, useCallback, useMemo } from 'react';
import {
	reactExtension,
	useApi,
	Banner,
	Button,
	ChoiceList,
	Choice,
	BlockStack,
	BlockSpacer,
	TextBlock,
} from '@shopify/ui-extensions-react/checkout';

import { gidToId } from './utils';

self.addEventListener('unhandledrejection', (error) => {
	console.error(error);
});
self.addEventListener('error', (error) => {
	console.error(error);
});

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const [hasExistingSavedCart, setHasExistingSavedCart] = useState(false);
	const [cartLinesToSave, setCartLinesToSave] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	const { buyerIdentity, lines, shop, extension } = useApi();

	const customerId = useMemo(
		() => gidToId(buyerIdentity.customer.current?.id),
		[buyerIdentity.customer.current]
	);

	const apiUrl = useMemo(() => {
		const appBaseUrl = extension.scriptUrl.split('/extensions')[0];
		const shopDomain = shop.myshopifyDomain;
		return `${appBaseUrl}/api?shop=${shopDomain}`;
	}, [extension.scriptUrl, shop.myshopifyDomain]);

	const saveHandler = useCallback(async () => {
		if (!customerId || !cartLinesToSave.length) return;

		setIsLoading(true);

		const variants = cartLinesToSave.map((lineId) => {
			const cartLine = lines.current.find((line) => line.id === lineId);
			return { id: gidToId(cartLine.merchandise.id), quantity: cartLine.quantity };
		});

		try {
			await fetch(apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customer_id: customerId,
					variants,
				}),
			});
		} catch (err) {
			console.error(err);
		}
		setHasExistingSavedCart(false);
		setIsLoading(false);
		setIsComplete(true);
	}, [customerId, cartLinesToSave, lines, apiUrl]);

	useEffect(() => {
		const checkHasSavedCart = async () => {
			if (!customerId) return;
			try {
				const response = await fetch(`${apiUrl}&customer_id=${customerId}`);
				const savedCart = await response.json();
				setHasExistingSavedCart(savedCart.length > 0);
			} catch (err) {
				console.error(err);
			}
		};
		checkHasSavedCart();
	}, [customerId, apiUrl]);

	const hasExistingCartBanner = hasExistingSavedCart ? (
		<Banner status="warning">
			<TextBlock>It seems you already have a saved cart.</TextBlock>
			<TextBlock emphasis="bold">Saving this current cart will overwrite it completely.</TextBlock>
		</Banner>
	) : (
		''
	);

	return isComplete ? (
		<Banner status="success" title="Your cart has been saved successfully! 🥳" />
	) : (
		<Banner status="info" title="Save your cart">
			<BlockStack>
				<ChoiceList name="cartLinesToSave" value={cartLinesToSave} onChange={setCartLinesToSave}>
					<BlockStack>
						{lines.current.map((line) => (
							<Choice key={line.id} id={line.id}>
								{line.merchandise.title}
							</Choice>
						))}
					</BlockStack>
				</ChoiceList>
			</BlockStack>
			<BlockSpacer />
			{hasExistingCartBanner}
			<BlockSpacer />
			<Button disabled={!cartLinesToSave.length} loading={isLoading} onPress={saveHandler}>
				Save
			</Button>
		</Banner>
	);
}
