import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { TiMessage } from "react-icons/ti";
const socket = io("https://live-poll-system.onrender.com"); 

const CreatePoll = () => {
    
    const {userId} = useParams();
    const [Mess, setMess] = useState('');
    const [iconclicked, seticonclicked] = useState(false);
    const [chatclicked, setchatclicked] = useState("participants");
    const [onlineUsers, setonlineUsers] = useState(null);
    const [chats,setChats] = useState(null);
    
    useEffect(() => {   
            if(!userId)
            {
               return;
            }        
            socket.emit("joinRoom", { userId });
            socket.on("onlineUsers", (users) => {
                setonlineUsers(users); 
            });
            
            socket.on("getAllMessages",(obj)=> {
                 setChats(obj);   
            });
            socket.on("getMess",(ob) => {
                setChats(prev => [...prev, ob])
            })
            return () => {
                socket.off("newPoll");
                socket.off("onlineUsers");
                socket.off("getAllMessages");
                socket.off("getMess");
                socket.off("pollCreated");
            };
    }, [userId]);

    
    const clickPart = () => {
    setchatclicked("participants"); 
    };

    const kickOutUser = (student) => {
           socket.emit("kickout",{student}) 
    }

    const [question,setquestion] = useState(null);
    const [time,settime] = useState(null);

    const [options, setOptions] = useState([
        { text: "", isCorrect: null },
    ]);

    const addOption = () => {
        setOptions([...options, { text: "", isCorrect: null }]);
    };
      const btnsmit = () => {
            if(!Mess)
            {
                toast.error('kindly enter message');
                return;
            }
            socket.emit('saveMessage',{message : Mess,userId});
      }

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
  };


    const submitHandler = (e) => {
        e.preventDefault();
        if(options.length === 0)
        {
            toast.error('kindly add atleast one option');
            return;
        }
        if(!time || !question)
        {
            toast.error('kindly fill all info');
            return;
        }
        socket.emit('createPoll',{ teacherId : userId, question : question, options : options, time: time });
        socket.on("pollCreated",(ob) => {
             if(ob.success)
             {
                 toast.success(ob.message);
                 setOptions([{ text: "", isCorrect: null }]);
                 setquestion(null);
                 settime(null);
             }else {
                toast.error(ob.message);
             }
        })
    }
    return (
    <div className="flex flex-col gap-3 relative">
        <h3 className="text-center border-2 border-primary bg-accent text-white font-bold rounded-full w-32">Intervue Poll</h3>
        <h1 className="text-grayDark text-lg font-bold">Let's <span className="text-2xl font-bold">Get Started</span></h1>
        <p className="text-grayLight mt-2">You'll have the ability to create and manage polls, ask questions , and monitor your students'responses in real-time</p>
        <p className="text-grayLight">in live polls and see your responses compare with your classmates</p>
        <form onSubmit={submitHandler} className="flex flex-col gap-5">
               <div  className="flex flex-col gap-2">
                   <div className="flex justify-between">
                   <label className="font-bold">Enter Your Question</label>
                   <select className="font-bold border-2 border-grayLight" onChange={(e) => settime(Number(e.target.value))}>
                            <option>select The Time</option>
                            <option value={60}>60 Seconds</option>
                            <option value={120}>120 Seconds</option>
                   </select>
                   </div>
                    <textarea onChange={(e) => setquestion(e.target.value)} rows={3} cols={20} value={question} id = 'question' className="border-2 bg-gray-100"/>
               </div>
               <div className="flex justify-between">
                    <p className="font-bold"> Edit Your Options </p>
                    <p className="font-bold">Is It Correct? </p>
               </div>
        {options.map((option, index) => (
                <div key={index} className="flex justify-between items-center gap-4">
                    <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                    }
                    className="border-2 bg-gray-100 p-2 flex-1"
                    placeholder={`Option ${index + 1}`}
                    />

                    <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-1 font-bold">
                        <input
                        type="radio"
                        name={`op-${index}`}
                        checked={option.isCorrect === true}
                        onChange={() => handleOptionChange(index, "isCorrect", true)}
                        />
                        YES
                    </label>

                    <label className="flex items-center gap-1 font-bold">
                        <input
                        type="radio"
                        name={`op-${index}`}
                        checked={option.isCorrect === false}
                        onChange={() => handleOptionChange(index, "isCorrect", false)}
                        />
                        NO
                    </label>
                    </div>
                </div>
                ))}
               <button type="submit" className="bg-accent rounded-md text-white w-fit p-2 absolute -bottom-20 right-0">Ask Question</button>
        </form>   
               <p onClick={addOption} className="text-primary border-2 border-primary w-fit p-2 rounded-md cursor-pointer mt-2"> + Add More Options</p>
                 
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
                           {chatclicked === "participants" &&
                           <div className="flex gap-5 justify-between p-2">
                                <p className="text-grayLight">Name</p>
                                <p className="text-grayLight">Action</p>
                           </div>
                           }
                           {chatclicked === "participants" && onlineUsers && onlineUsers.map((u, i) => (
                                 <div className="flex gap-5 justify-between items-baseline">
                                    <p key={i} className="p-1 m-1 font-semibold text-lg rounded-xl">{u.Name}</p>
                                    <p className="text-accent cursor-pointer" onClick={() => kickOutUser(u._id)}><u>kick out</u></p>
                                </div>
                           ))}
                           {chatclicked === "chat" && chats && chats.map((c) => {
                               return (
                                    <div className="flex flex-col gap-1 m-2">
                                        <p>{c.Name}:</p>
                                        <p>{c.Message}</p>
                                    </div>
                               )
                           })}
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
                     

    </div>)
}

export default CreatePoll;