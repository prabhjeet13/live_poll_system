import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
   const [role,setrole]  = useState('Student');
   const navigate = useNavigate();
   const continueBtn = () => {
       if(role === "Student")
       {
           navigate('/student/enter');
       }else {
           navigate('/teacher/enter');
       }
   } 
   return (
    <div className="flex flex-col items-center p-1 gap-1">
        <h3 className="text-center border-2 border-primary bg-accent text-white font-bold rounded-full w-32">Intervue Poll</h3>
        <h1 className="text-grayDark text-lg font-bold">Welcome to the <span className="text-2xl font-bold">Live Polling System</span></h1>
        <span className="text-grayLight mt-2">Please select the role that describes you to begin using the polling system</span>
        <div className="flex justify-evenly gap-10 mt-8 cursor-pointer">
            <div onClick={ () => setrole('Student')} className={`flex flex-col rounded-md ${role === "Student" ? "border-2 border-primary p-2"  : "border-2 border-grayLight p-2"}`}>
                     <p className="text-grayDark text-lg font-bold" > I'am a Student</p>
                     <p className="text-grayLight"> Submit your Answers Live</p>
            </div>
            <div onClick={() => setrole('Teacher')} className={`flex flex-col rounded-md ${role === "Teacher" ? "border-2 border-primary p-2"  : "border-2 border-grayLight p-2"}`}>
                    <p className="text-grayDark text-lg font-bold">I'am a Teacher</p>
                    <p className="text-grayLight">Create Your Polls and view live poll</p>
                    <p className="text-grayLight"> results in real-time</p>
            </div>
        </div>
        <p onClick={continueBtn} className="text-center border-2 border-primary bg-accent text-white font-bold rounded-full w-32 mt-3 p-2 cursor-pointer transition-all duration-200 hover:scale-90">Continue</p>
    </div>
   )
}


export default Home;