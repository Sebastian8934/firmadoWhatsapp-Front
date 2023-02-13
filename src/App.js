import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import SignIn from './SignIn';
import SignUp from './SingUp';
import Home from './home';

function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<SignIn/>}/>
    <Route path='/signUp' element={<SignUp/>}/>  
    <Route path='/form' element={<Home/>}/> 
    </Routes>
   </BrowserRouter>
  );
}

export default App;
