import { useEffect, useMemo, useState } from 'react';
import { useCustomer, useExtension, useShop } from '@shopify/ui-extensions-react/checkout';
import { gidToId } from '../utils';

// Returns whether or not the customer has an existing saved cart

export const useHasExistingCart = () => {
	const { scriptUrl } = useExtension();
	const { myshopifyDomain } = useShop();
	const customer = useCustomer();

	const customerId = useMemo(() => customer && gidToId(customer?.id), [customer]);
	const apiUrl = useMemo(
		() => `${scriptUrl.split('/extensions')[0]}/api?shop=${myshopifyDomain}`,
		[scriptUrl, myshopifyDomain]
	);

	const [hasExistingSavedCart, setHasExistingSavedCart] = useState(false);

	useEffect(() => {
		const fetchSavedCart = async () => {
			if (!customerId) return;
			try {
				const response = await fetch(`${apiUrl}&customer_id=${customerId}`);
				const savedCart = await response.json();
				setHasExistingSavedCart(savedCart.length > 0);
			} catch (err) {
				console.error(err);
			}
		};
		fetchSavedCart();
	}, [apiUrl, customerId]);

	return hasExistingSavedCart;
};
