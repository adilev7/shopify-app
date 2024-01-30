import { useMemo } from 'react';
import { useCustomer } from '@shopify/ui-extensions-react/checkout';
import { gidToId } from '../utils';

export const useCustomerId = () => {
	const customer = useCustomer();
	return useMemo(() => customer && gidToId(customer?.id), [customer]);
};
