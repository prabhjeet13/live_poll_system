import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { TiMessage } from "react-icons/ti";
import toast from "react-hot-toast";

const socket = io("https://live-poll-system.onrender.com"); 

const ActivePoll = () => {
  const [iconclicked, seticonclicked] = useState(false);
  const [Mess, setMess] = useState('');
  const [chatclicked, setchatclicked] = useState("participants");
  const [onlineUsers, setonlineUsers] = useState(null);
  const [latestPoll, setLatestPoll] = useState(null); 
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();
    const [chats,setChats] = useState(null);

  useEffect(() => {   
    if (!userId) return;
    
    socket.emit("joinRoom", { userId });
    socket.on("newPoll", (poll) => {
      setLatestPoll(poll); 
      setHasVoted(false); 
      setSelectedOption(null);
    });
    socket.on("onlineUsers", (users) => {
      setonlineUsers(users); 
    });
    socket.on("kickoutdone",(ob) => {
            socket.disconnect();
            navigate(`/student/exit/${userId}`);
    })
    socket.on("getAllMessages",(obj)=> {
         setChats(obj);   
    });
    socket.on("getMess",(ob) => {
        setChats(prev => [...prev, ob])
    })
    return () => {
      socket.off("newPoll");
      socket.off("onlineUsers");
      socket.off("kickoutdone")
      socket.off("getAllMessages")
      socket.off("getMess")
    };
  }, [userId]);

  const clickPart = () => {
    setchatclicked("participants"); 
  };
  
  const btnsmit = () => {
        if(!Mess)
        {
            toast.error('kindly enter message');
            return;
        }
        socket.emit('saveMessage',{message : Mess,userId});
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!latestPoll || !selectedOption) return;
    const data = {
      pollId: latestPoll._id,
      optionId: selectedOption,
      teacherId: latestPoll.Createdby,
      studentId: userId,
    };
    socket.emit("submitPoll", data);
    setHasVoted(true);                
    socket.once("pollHistory", (poll) => {
      setLatestPoll(poll);
    });
  };

  return (
    <div className="relative">
      {/* Poll Section */}
      
      { !latestPoll ? (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent"></div>
          <p className="text-grayLight text-xl font-bold">Waiting for teacher to ask questions...</p>
        </div>
      ) : (
        <div className="border-2 border-red-200 p-10 m-4 flex flex-col items-start">
          <p className="text-red-500 font-bold text-lg"><span className="text-black">Question</span> {latestPoll.Time}</p>
          <form onSubmit={submitHandler} className="flex flex-col gap-4 items-end mt-2">
            <div className="flex flex-col gap-2 border-2 border-accent rounded-md">
              <p className="bg-grayDark text-white font-bold">{latestPoll.Question}</p>
              {latestPoll?.Options && latestPoll.Options.map((option, index) => {
                const totalVotes = latestPoll.AnsweredBy?.length || 0;
                const percentage = totalVotes > 0 
                  ? ((option.Submits / totalVotes) * 100).toFixed(1) 
                  : 0;
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-evenly px-4 ml-2 border-2 rounded mb-3 w-[90%] cursor-pointer ${selectedOption && option && selectedOption === option._id ? "bg-white border-accent text-black" : "bg-gray-100"}`}
                  >
                    <p className="p-1" onClick={() => !hasVoted && setSelectedOption(option._id)}>
                      <span className="rounded-full bg-primary px-2 m-2">{index+1}</span> {option.Text}
                    </p>
                    {hasVoted && (
                      <p className="text-sm text-gray-500">{percentage}%</p>
                    )}
                  </div>
                );
              })}
            </div>
            {!hasVoted && (
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-accent text-white rounded hover:bg-primary transition"
              >
                Submit
              </button>
            )}
          </form>
        </div>
      )}


      <div 
        onClick={() => seticonclicked(true)} 
        className="absolute -bottom-60 -right-40 cursor-pointer"
      >
        <TiMessage className='text-6xl text-accent border-accent'/>
      </div>

     
      {iconclicked && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
         
          <div 
            className="absolute inset-0 bg-gray-500 bg-opacity-10" 
            onClick={() => seticonclicked(false)}
          />
          
          <div className="relative bg-white rounded-lg shadow-lg w-96 p-4 z-10">
            <div className="flex gap-5 justify-start font-bold text-md mb-2">
              <p 
                className={`${chatclicked === "chat" ? "text-black" : "text-grayDark"} cursor-pointer`} 
                onClick={() => setchatclicked("chat")}
              >
                Chat
              </p>
              <p 
                className={`${chatclicked === "participants" ? "text-black" : "text-grayDark"} cursor-pointer`} 
                onClick={clickPart}
              >
                Participants
              </p>
            </div>
            <hr className="w-full mb-2"/>
            {chatclicked === "participants" && <p className="text-grayLight">Name</p>}
            {chatclicked === "participants" && onlineUsers && onlineUsers.map((u, i) => (
              <p key={i} className="p-3 m-2 font-semibold text-lg rounded-xl shadow-md border bg-white hover:bg-gray-100 transition">{u.Name}</p>
            ))}
           {chatclicked === "chat" && chats && (
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto p-2">
                {chats.map((c, i) => (
                <div key={i} className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200">
                    <p className="font-semibold text-sm text-gray-700">{c.Name}:</p>
                    <p className="text-gray-600">{c.Message}</p>
                </div>
                ))}
            </div>
            )}

            {chatclicked === "chat" && (
            <div className="mt-3 flex gap-2 items-center">
                <input
                type='text'
                value={Mess}
                onChange={(e) => setMess(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-md border-2 border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                onClick={btnsmit}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition"
                >
                Send
                </button>
            </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default ActivePoll;
