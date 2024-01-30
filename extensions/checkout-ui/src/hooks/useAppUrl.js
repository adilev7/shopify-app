import { useMemo } from 'react';
import { useExtension, useShop } from '@shopify/ui-extensions-react/checkout';

export const useAppUrl = () => {
	const { scriptUrl } = useExtension();
	const { myshopifyDomain } = useShop();

	const appUrl = useMemo(
		() => `${scriptUrl.split('/extensions')[0]}/api?shop=${myshopifyDomain}`,
		[scriptUrl, myshopifyDomain]
	);

	return appUrl;
};
