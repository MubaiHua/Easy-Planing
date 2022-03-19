import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/loginPage";
import SignUp from "./pages/signupPage";
import CalenderPage from './pages/calenderPage';
import TaskPage from './pages/taskPage'
function App() {
  return (<Router>
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Routes>
            <Route exact path='/' element={<Login />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/calender" element={<CalenderPage />} />
            <Route path="/task" element={<TaskPage />} />
          </Routes>
        </div>
      </div>
    </div></Router>
  );
}
export default App;