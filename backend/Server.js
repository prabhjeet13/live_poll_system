const { dbConnect } = require('./Config/DBConnect');
const User = require('./Models/Users');
const UserRoutes = require('./Routes/User');
const express = require('express');
require('dotenv').config();
const {Server} = require('socket.io');
const http = require('http');
const { createPoll, submitPoll, PollHistory } = require('./Controllers/Poll');
const { kickOutUser } = require('./Controllers/User');
const app = express();
dbConnect();

const cors = require('cors');
const Poll = require('./Models/Poll');
const { saveChats } = require('./Controllers/Chat');
const Chat = require('./Models/Chat');
app.use(cors({
    origin: "https://live-poll-system-one.vercel.app", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


app.use(express.json());
app.use('/api/v1/users',UserRoutes);




const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://live-poll-system-one.vercel.app",
        methods: ["GET", "POST"],
        credentials: true,
    }
});


let socketToUser = {};  
let userToSocket = {};  

io.on('connection',socket => {
    console.log('new socket connected');

    // join room
    socket.on('joinRoom', async ({userId}) => {
        const user = await User.findById(userId);
        if (!user) return;
        socketToUser[socket.id] = userId;
        userToSocket[userId] = socket.id;

        user.SocketId = socket.id;

        await user.save();

        if(user.Role === "Student")
        {
            // Send latest active poll to this user
            const latestPoll = await Poll.findOne({ IsActive: true }).sort({createdAt : -1}).populate('Options').exec();
            if (latestPoll) socket.emit('newPoll', latestPoll);
        }
        const onlineUsers = await User.find({ IsActive: true }).sort({createdAt: -1});
        io.emit('onlineUsers', onlineUsers);

        const chats = await Chat.find({IsActive : true});
        io.emit('getAllMessages',chats);
    })

    socket.on('disconnect', async () => {
         
        
        const userId = socketToUser[socket.id];
        delete socketToUser[socket.id];
        delete userToSocket[userId];
        
        const user = await User.findOne({SocketId:socket.id,_id : userId});
          if (user) {
            user.IsActive = false;
            user.SocketId = null;
            await user.save();

            
            if (user.Role === 'Teacher') {
                await Poll.updateMany(
                    { CreatedBy: user._id, IsActive: true }, 
                    { $set: { IsActive: false } }
                );
                await Chat.updateMany(
                    {IsActive: true }, 
                    { $set: { IsActive: false } }
                );
            }
          }
        
        const onlineUsers = await User.find({ IsActive: true }).sort({createdAt: -1});
        io.emit('onlineUsers', onlineUsers);
    })   

    socket.on('createPoll', async ({ teacherId, question, options, time }) => {
        try {
            const pollData = { teacher: teacherId, question, options, time };
            const poll = await createPoll(pollData,Object.keys(socketToUser).length-1); 
            socket.emit('pollCreated', {success: true, poll,message:'poll created'});            
            const students = await User.find({ Role: 'Student', IsActive: true });
            for(const student of students){
                const studentSocket = userToSocket[student._id.toString()];
                if(studentSocket) io.to(studentSocket).emit('newPoll', poll);
            }
        } catch(err){
            socket.emit('pollCreated', { success: false, message: err.message });
        }
    });

    socket.on('submitPoll', async ({ pollId, studentId, optionId, teacherId }) => {
        try {
            const submissionData = { pollId, student: studentId, option: optionId, teacher: teacherId };
            const poll = await submitPoll(submissionData);

            socket.emit('pollSubmitted', result);

            const latestResult = await PollHistory(poll._id);    
            
            const teacherSocket = userToSocket[teacherId];
            if(teacherSocket) io.to(teacherSocket).emit('pollHistory', latestResult);

            io.to(socket.id).emit("pollHistory", latestResult);

        } catch(err){
            socket.emit('pollSubmitted', { success: false, message: err.message });
        }
    });

    socket.on("kickout",async ({student}) => {
        try {
              const socketId = userToSocket[student];
              delete socketToUser[socketId];
              delete userToSocket[student];

              const result = await kickOutUser(student);
              
               io.to(socketId).emit("kickoutdone",{flag : 1});

              const onlineUsers = await User.find({ IsActive: true }).sort({createdAt: -1});
              io.emit('onlineUsers', onlineUsers);

        }catch(error)
        {
            socket.emit('kickoutStudent', { success: false, message: err.message });
        }
    })  

    socket.on("saveMessage", async({message,userId}) => {
           
           const user = await User.findById(userId);
           if (!user) return;
           const chatRes = await saveChats({message,name: user.Name});
           io.emit('getMess',{Message: message,Name: user.Name,IsActive : true});
    })

})


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`)
})       

