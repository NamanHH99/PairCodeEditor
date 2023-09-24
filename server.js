const express  = require("express");
const {Server} =  require("socket.io");
const http = require("http");
const ACTIONS = require("./src/Actions");

const app = express();

const server = http .createServer(app);
const userSocketMap  = {};
const io = new Server(server);
app.use(express.static('build'));
app.use((req,res,next) => {
    res.sendFile(path.join(__dirname,'build','index.html'));
})
function getAllConnectedUsers(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            name: userSocketMap[socketId],
        };
    });
}
io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);
    socket.on(ACTIONS.JOIN,({roomId,name}) => {
        userSocketMap[socket.id] = name;
        socket.join(roomId);
        const users =  getAllConnectedUsers(roomId);
        users.forEach(({socketId})=>{
            io.to(socketId).emit(ACTIONS.JOINED,{
                users,
                name,
                socketId: socket.id,
            });
        })
    });
    socket.on(ACTIONS.CODE_CHANGE,({roomId,code}) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {code});
    })
    socket.on(ACTIONS.SYNC_CODE,({socketId,code}) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, {code});
    })
    socket.on('disconnecting',() => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId)=>{
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                name: userSocketMap[socket.id],
            })
        });
        delete userSocketMap[socket.id];
        socket.leave();
    })
});

const PORT = process.env.PORT || 5000;
server.listen(PORT,() => {console.log(`Listening on port ${PORT}`)});