import axios from "axios";

export const searchProducts = async (text: string) => {
	const result = await axios.get(
		`/api/list?table=products_with_stock_totals&query=${text}`,
	);
	return result.data.results.products;
};

export const searchProductsCategories = async () => {
	const result = await axios.get(
		`/api/list?table=moneyflow-categories`,
	);
	return result.data.product_categories;
};