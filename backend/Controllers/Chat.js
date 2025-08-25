const Chat = require('../Models/Chat');


exports.saveChats =  async (chatData) => {
        try {
                const {message,name} = chatData;

                const ChatRes = await Chat.create({
                            Name : name,
                            Message : message,
                            IsActive : true,
                });



                return ChatRes;
        }
        catch(error)
        {
            throw new Error(error.message || "Something went wrong");
        }
}   


