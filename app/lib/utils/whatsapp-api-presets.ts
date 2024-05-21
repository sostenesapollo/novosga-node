export const whatsappApiUrl =
	`${process.env.BASE_URL_WHATSAPP_API}` ||
	"https://wpbot.pedegas.com/api/v1";
export const serverUrl =
	process.env.NODE_ENV === "development"
		? `http://localhost:${process.env.PORT || 3002}`
		: "https://wpbot.pedegas.com/api/v1";

export const defaultChatName = "pedegas";
