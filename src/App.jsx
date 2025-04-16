
import { Route, Routes } from 'react-router'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Navbar from './components/Navbar'

function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/inscription' element={<Register />} />
        <Route path='/connexion' element={<Login />} />
      </Routes>
    </>
  )
}

export default App
