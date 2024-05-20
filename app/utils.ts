export const serverUrl =
	process.env.NODE_ENV === "development"
		? `http://localhost:${process.env.PORT || 3002}`
		: "https://wpbot.pedegas.com/api/v1";