const { Message, User } = require('./db');
require('dotenv').config();

const io = require('socket.io')(10000, {
  cors: {
    origin: "*",
  }
});

const MESSAGES_PER_PAGE = 15;

io.on('connection', (socket) => {

  socket.on('message', async (msg) => {
    const message = new Message({ message: msg.message, user: msg.user });
    await message.save();

    io.emit('message', message);
  });



  socket.on('start', async () => {
    const messages = await Message.find().sort({ _id: -1 }).limit(MESSAGES_PER_PAGE).exec();
    socket.emit('start', messages.reverse()); // Reverse to show oldest first
  })


  socket.on('loadMore', async (page) => {
    const moreMessages = await Message.find().sort({ _id: -1 }).skip((page-1) * MESSAGES_PER_PAGE).limit(MESSAGES_PER_PAGE).exec();
    socket.emit('moreMessages', moreMessages.reverse()); // Reverse to show oldest first
  });

  socket.on('username', async (username)=>{
    const user = await User.findOne({ username: username });
    console.log(user);
    if(user)
      socket.emit('username', user.user);
    else
      socket.emit('username', false);
  })

});

console.log('Server running on PORT 10000');
