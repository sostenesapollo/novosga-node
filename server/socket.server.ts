import express from "express";
import { createServer } from "http"; // Import http module
import { Server } from "socket.io"; // Import socket.io module
// import { createClient } from "redis";
// import { createAdapter } from "@socket.io/redis-adapter";
import invariant from "tiny-invariant";
import { CookieParams, sessionStorage } from "@/session.server";
import { getGroupNamePrinter } from "@/lib/utils/utils";
import { prisma } from "@/db.server";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// const pubClient = createClient({ url: process.env.REDIS_URL });
// const subClient = pubClient.duplicate();

// io.adapter(createAdapter(pubClient, subClient));

// invariant(
// 	process.env.SOCKET_IO_PORT,
// 	"Need to provide socket io port {process.env.SOCKET_IO_PORT}",
// );

// Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
	console.log(
		`Socket io server listening at port ${process.env.SOCKET_IO_PORT}`,
	);

	io.listen(parseInt(process.env.SOCKET_IO_PORT || ""));
// });

export const getCompanyOnlyGroup = (company_id: string) =>
	`company/${company_id}`;

io.on("connection", async (socket) => {
	// const user = (
	// 	await sessionStorage.getSession(socket.handshake.headers.cookie)
	// ).data as CookieParams;

	console.log(
		`🔔 ✅ New Frontend Socket Connected [${socket.id}]]`,
	);

	socket.on("disconnect", () => {
		console.log("Frontend Socket disconnected");
	});

	socket.on('call-next', async (data: any) => {
		let next = await prisma.ticket.findFirst({where: {waiting: true}})
		if(!next) return socket.emit('message', {message: 'Nenhuma senha para ser chamada', type: 'info'})

		await prisma.ticket.update({where: {id: next?.id}, data: {waiting: false}})
		next = await prisma.ticket.findFirst({where: {waiting: true}})
		io.sockets.emit('call-next', next)
	})

	socket.on('call-again', async (data: any) => {
		const next = await prisma.ticket.findFirst({where: {waiting: true}})
		io.sockets.emit('call-again', next)
	})

	socket.on('generate-ticket', async (data: any) => {
		console.log('gerar ticket');
		
		const number = Math.random().toString(36).substring(7)
		await prisma.ticket.create({
			data: {
				priority: data.priority,
				waiting: true,
				desk: '1',
				number: number
			}
		})

		io.sockets.emit('new-tickets-available', true)
	})
});

export { app, io, httpServer };
