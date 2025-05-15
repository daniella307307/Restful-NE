import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PrivateRoute from './PrivateRoute'
import Dashboard from './pages/Dashboard'
import Loader from './pages/Loader'
import { useState } from 'react'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import RegisterPage from './pages/RegisterPage'
function App() {
  const [isLoading,setIsLoading]= useState(true);
  useEffect(()=>{
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return ()=> clearTimeout(timer)
  },[]);
  if(isLoading){
    return <Loader/>
  }
  return (
   <div className='bg-blue'>
     <Router> 
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      </Routes>
    </Router>
    <ToastContainer
    position='top-right'
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={true}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    />
   </div>
  )
}

export default App
