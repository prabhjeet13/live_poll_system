import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Teacher from './Pages/Teacher';
import Student from './Pages/Student';
import CreatePoll from './Pages/CreatePoll';
import ActivePoll from './Pages/ActivePoll';
import ExitStudent from './Pages/ExitStudent';
function App() {
  return (
    <div className="mx-auto min-h-[100vh] max-w-[1260px] flex items-center justify-evenly">
      <Routes>
             <Route path = '/' element = {<Home/>}> </Route>
             <Route path = '/student/enter' element = {<Student/>}> </Route>
             <Route path = '/teacher/enter' element = {<Teacher/>}> </Route>
             <Route path = '/teacher/createpoll/:userId' element = {<CreatePoll/>}> </Route>
             <Route path = '/student/activepoll/:userId' element = {<ActivePoll/>}> </Route>
             <Route path = '/student/exit/:userId' element = {<ExitStudent/>}> </Route>
      </Routes>
    </div>
  );
}

export default App;
