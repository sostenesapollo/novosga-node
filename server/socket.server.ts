import express from "express";
import { createServer } from "http"; // Import http module
import { Server } from "socket.io"; // Import socket.io module
import { prisma } from "../app/db.server";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

export const getCompanyOnlyGroup = (company_id: string) =>
	`company/${company_id}`;

io.on("connection", async (socket) => {
	console.log(
		`🔔 ✅ New Frontend Socket Connected [${socket.id}]]`,
	);

	socket.on("disconnect", () => {
		console.log("Frontend Socket disconnected");
	});

	socket.on('call-next', async (data: any) => {
		let next = await prisma.ticket.findFirst({where: {waiting: true}})
		await prisma.ticket.update({where: {id: next.id}, data: {waiting: false}})
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

io.listen(parseInt(process.env.SOCKET_IO_PORT || ""));

export { app, io, httpServer };
