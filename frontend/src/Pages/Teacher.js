import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Teacher = () => {
   const [formData,setFormData] = useState({
      name: "",
      role: "Teacher"
    });
    const navigate = useNavigate();
     const textboxvaluechange = (e) => {
      setFormData( (prev) => ({
         ...prev,
         [e.target.name] : e.target.value,
      }))
    }
    const onSubmitHandler = async (e) => {
          e.preventDefault();
          
         if(formData.name === "" || formData.name === null)
         {
            toast.error('Kindly Enter your name');
            return;
         }
         try {
                 // api call for create
            const result = await axios.post('http://localhost:4001/api/v1/users/createuser',formData, {
         withCredentials: true
         });
            if(result.status === 201 && result.data.flag === 1)
            {
                  toast.success(result.data.flag_message);  
                  const userId = result.data.userId;
                  navigate(`/teacher/createpoll/${userId}`);
            }else {
                  toast.error(result.data.flag_message);      
            }
         }catch(error)
         {
            toast.error('something went wrong')
         }
    }
   return (
    <div className="flex flex-col items-center p-1">
        <h3 className="text-center border-2 border-primary bg-accent text-white font-bold rounded-full w-32">Intervue Poll</h3>
        <h1 className="text-grayDark text-lg font-bold">Let's <span className="text-2xl font-bold">Get Started</span></h1>
        <p className="text-grayLight mt-2">If You're a Teacher, you will be ale to create your polls, participate</p>
        <p className="text-grayLight">in live polls and see the responses of your classmates</p>
        <form onSubmit={onSubmitHandler} className="flex flex-col justify-start mt-5 w-[80%]">
            <label className="p-2">
                  Enter Your Name
            </label>
                <input onChange={textboxvaluechange} value = {formData.name} type= 'text' name = 'name' id = 'name' className="bg-gray-200 rounded-md w-[90%] p-2 m-2"/>
            <button type = 'Submit' className="mx-auto text-center border-2 border-primary bg-accent text-white font-bold rounded-full w-32 mt-3 p-2 cursor-pointer transition-all duration-200 hover:scale-90">Continue</button>
          </form>
    </div>
   )
}


export default Teacher;