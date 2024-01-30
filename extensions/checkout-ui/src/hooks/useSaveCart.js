import { useCallback, useState } from 'react';
import { useCartLines } from '@shopify/ui-extensions-react/checkout';
import { useCustomerId, useAppUrl } from '../hooks';
import { gidToId } from '../utils';

export const useSaveCart = (cartLinesToSave) => {
  const appUrl = useAppUrl();
	const customerId = useCustomerId();
	const cartLines = useCartLines();

	const [isLoading, setIsLoading] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	const saveCart = useCallback(async () => {
		if (!customerId || !cartLinesToSave.length) return;

		setIsLoading(true);

		const variants = cartLinesToSave.map((lineId) => {
			const cartLine = cartLines.find((line) => line.id === lineId);
			return { id: gidToId(cartLine.merchandise.id), quantity: cartLine.quantity };
		});

		try {
			await fetch(appUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customer_id: customerId,
					variants,
				}),
			});
			setIsComplete(true);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, [appUrl, customerId, cartLinesToSave, cartLines]);

	return { isLoading, isComplete, saveCart };
};
