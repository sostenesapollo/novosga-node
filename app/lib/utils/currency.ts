export const localMoney = (value: string | number): string => {
	if (typeof value === "string")
		return (
			parseFloat(value)?.toLocaleString("pt-BR", {
				style: "currency",
				currency: "BRL",
			}) || "R$ 0,00"
		);
	if (typeof value === "number")
		return (
			value?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ||
			"R$ 0,00"
		);
	return "";
};

export const moneyStrToFloat = (value: string): number => {
	if (typeof value === "number") return value;
	try {
		return (
			parseFloat(
				value
					.replace(/ /g, "")
					.replace("R$", "")
					["replaceAll"](".", "")
					["replaceAll"](",", "."),
			) || 0
		);
	} catch (e) {
		return 0;
	}
};
