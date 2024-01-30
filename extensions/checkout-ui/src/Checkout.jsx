import { useState } from 'react';
import {
	reactExtension,
	Banner,
	Button,
	ChoiceList,
	Choice,
	BlockStack,
	BlockSpacer,
	TextBlock,
	useCartLines,
} from '@shopify/ui-extensions-react/checkout';

import { useCustomerId, useHasExistingCart, useSaveCart } from './hooks';
import { addErrorListeners } from './utils';

addErrorListeners();

export default reactExtension('purchase.checkout.block.render', () => <Extension />);

function Extension() {
	const [cartLinesToSave, setCartLinesToSave] = useState([]);
	const { isLoading, isComplete, saveCart } = useSaveCart(cartLinesToSave);

	const customerId = useCustomerId();
	const cartLines = useCartLines();
	const hasExistingSavedCart = useHasExistingCart();

	const warningBanner = hasExistingSavedCart && (
		<Banner status="warning">
			<TextBlock>It seems you already have a saved cart.</TextBlock>
			<TextBlock emphasis="bold">Saving this current cart will overwrite it completely.</TextBlock>
		</Banner>
	);

	if (!customerId) return null;

	if (isComplete) {
		return <Banner status="success" title="Your cart has been saved successfully! 🥳" />;
	}

	return (
		<Banner status="info" title="Save your cart">
			<BlockStack>
				<ChoiceList name="cartLinesToSave" value={cartLinesToSave} onChange={setCartLinesToSave}>
					<BlockStack>
						{cartLines.map((line) => (
							<Choice key={line.id} id={line.id}>
								{line.merchandise.title}
							</Choice>
						))}
					</BlockStack>
				</ChoiceList>
			</BlockStack>
			<BlockSpacer />
			{warningBanner}
			<BlockSpacer />
			<Button disabled={!cartLinesToSave.length} loading={isLoading} onPress={saveCart}>
				Save
			</Button>
		</Banner>
	);
}
