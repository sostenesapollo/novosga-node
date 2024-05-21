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

async function emitAllTicketsNotCalled(io) {
	const tickets = await prisma.ticket.findMany({where:{waiting: true, called_counter: 0}, orderBy: {createdAt: 'asc'}})
	io.sockets.emit('new-tickets-available', { tickets })
}

async function callAgain(io) {
	const next = await prisma.ticket.findFirst({where: {waiting: true}, orderBy: {createdAt: 'asc'}})
	console.log('Call again', next);

	if(!next) return;

	await prisma.ticket.update({where: {id: next?.id}, data: {called_counter: (next?.called_counter || 0) + 1 }})
	io.sockets.emit('call-ticket', next)
	await emitAllTicketsNotCalled(io)
}

io.on("connection", async (socket) => {
	// const user = (
	// 	await sessionStorage.getSession(socket.handshake.headers.cookie)
	// ).data as CookieParams;


	callAgain(io).then(()=>{})
	emitAllTicketsNotCalled(io).then(()=>{})
	
	console.log(
		`🔔 ✅ New Frontend Socket Connected [${socket.id}]]`,
	);

	socket.on("disconnect", () => {
		console.log("Frontend Socket disconnected");
	});

	socket.on('call-next', async (data: any) => {
		console.log('call next');
		
		let next = await prisma.ticket.findFirst({where: {waiting: true}, orderBy: {createdAt: 'asc'}})
		
		console.log('next', next);

		if(!next) return socket.emit('message', {message: 'Nenhuma senha para ser chamada', type: 'info'})

		await prisma.ticket.update({where: {id: next?.id}, data: {waiting: false}})
		next = await prisma.ticket.findFirst({where: {waiting: true}})
		io.sockets.emit('call-ticket', next)
		await emitAllTicketsNotCalled(io)
	})

	socket.on('call-again', (data: any) => callAgain(io))

	socket.on('generate-ticket', async (data: any) => {
		// await prisma.ticket.deleteMany()
		console.log('gerar ticket');
		let lastNumber = await prisma.ticket.findFirst({orderBy: {createdAt: 'desc'}}) || {number: '10'}

		await prisma.ticket.create({
			data: {
				priority: data.priority,
				waiting: true,
				desk: '1',
				number: String(parseInt(lastNumber?.number) + 1)
			}
		})

		await emitAllTicketsNotCalled(io)
	})
});

export { app, io, httpServer };
