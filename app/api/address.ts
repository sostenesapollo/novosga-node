import axios from "axios";

export const getAddressUsingZipcode = (zipcode: string) =>
	axios.get(`https://brasilapi.com.br/api/cep/v1/${zipcode}`);

export const getCitiesUsingStateCode = (stateCode: string) =>
	axios.get(
		`https://brasilapi.com.br/api/ibge/municipios/v1/${stateCode}?providers=gov`,
	);

export const searchAddress = async (text: string) => {
	const result = await axios.get(`/api/list?table=address&q=${text}`);
	return result.data.addresses as [];
};

export const searchNeighborhood = async (text: string) => {
	const result = await axios.get(`/api/list?table=neighborhood&q=${text}`);
	return result.data.neighborhoods as [];
};

export const searchCity = async (text: string) => {
	const result = await axios.get(`/api/list?table=city&q=${text}`);
	return result.data.cities as [];
};
