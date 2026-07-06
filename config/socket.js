const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initSocket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.use((socket, next) => {

        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Authentication Error"));
        }

        try {

            const user = jwt.verify(token, process.env.JWT_SECRET);

            socket.user = user;

            next();

        } catch (error) {

            next(new Error("Invalid Token"));

        }

    });

    io.on("connection", (socket) => {

        console.log("User Connected :", socket.user.userId);

        socket.join(socket.user.role);

        socket.join(socket.user.userId);

        socket.on("disconnect", () => {
            console.log("User Disconnected");
        });

    });

};

const getIO = () => io;

module.exports = {
    initSocket,
    getIO,
};