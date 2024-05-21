import {
	Home,
	LineChart,
	LogOut,
	Package,
	Settings,
	ShoppingCart,
	Users2,
} from "lucide-react";

export const routesMapping = [
	// { icon: Home, to: "/dashboard", path: "routes/dashboard", name: "Início" },
	// {
	// 	icon: ShoppingCart,
	// 	to: "/dashboard/orders",
	// 	path: "routes/dashboard.orders",
	// 	name: "Vendas",
	// },
	// {
	// 	icon: Package,
	// 	to: "/dashboard/products",
	// 	path: "routes/dashboard.products",
	// 	name: "Produtos",
	// },
	{
		icon: Users2,
		to: "/dashboard/clients",
		path: "routes/dashboard.clients",
		name: "Clientes",
	},
	// {
	// 	icon: LineChart,
	// 	to: "/dashboard/reports",
	// 	path: "routes/dashboard.reports",
	// 	name: "Relatórios",
	// },
];

export const routesMappingBottom = [
	{
		icon: Settings,
		to: "/dashboard/settings",
		path: "routes/dashboard.settings",
		name: "Configurações",
	},
	{
		icon: LogOut,
		to: "/logout",
		name: "Sair do sistema",
	},
];
