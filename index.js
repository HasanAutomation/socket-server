const io = require('socket.io')(8900,{
    cors:{
        origin:'http://localhost:3000'
    }
})

let users = [];

const addUser = (socketId,userId) => {
    !users.some(user => user.userId === userId) && users.push({userId,socketId})
}
const removeUser = socketId => {
    users = users.filter(user => user.socketId!==socketId)
}
const getUser = userId => users.find(user => user.userId === userId)

io.on('connection',socket => {
    socket.on('addUsers',userId => {
        addUser(socket.id,userId);
        io.emit('getUsers',users)
    })

    // send and get messages
    socket.on('sendMessage',({senderId,receiverId,text}) => {
        const otherUser = getUser(receiverId);
        io.to(otherUser.socketId).emit('getMessage',{
            senderId,
            text
        })
    })

    socket.on('disconnect',() => {
        removeUser(socket.id);
        io.emit('getUsers',users)
    })
})