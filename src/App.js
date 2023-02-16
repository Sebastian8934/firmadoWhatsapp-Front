import { BrowserRouter, Routes, Route} from 'react-router-dom'
import SignIn from './SignIn';
import SignUp from './SingUp';
import Home from './home';
import  image from './media/MicrosoftTeams-image.png'

function App() {
  return (
 <div style={{backgroundImage: `url(${image})`, width: '100%', height: '100%', position: 'absolute', overflow: 'auto'}}>
   <BrowserRouter>
   <Routes>
    <Route path='/' element={<SignIn/>}/>
    <Route path='/signUp' element={<SignUp/>}/>  
    <Route path='/form' element={<Home/>}/> 
    </Routes>
   </BrowserRouter>
   </div>
   
  );
}

export default App;
