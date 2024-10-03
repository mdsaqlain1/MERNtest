import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home  from './components/Home'
import Employes from './components/Employes'
import CreateEmployeeForm from './components/Empolyee'
import UpdateEmployee from './components/UpdateEmployee'
import { Landing } from './components/Landing'
import { AddCourse } from './components/Addcourse'

function App() {

  return (
    <>
      <div className='px-4'>
        <img src="logo.svg" height={"50px"} width={"50px"} alt="" />
      </div>
      <Router>
        <Routes>
          <Route path='/' element={<Landing/>} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/home' element={<Home />} />
          <Route path='/employes' element={<Employes />} />
          <Route path='/employeeform' element={<CreateEmployeeForm />} />
          <Route path='/updateemployee/:id' element={<UpdateEmployee />} />
          <Route path='/addcourse' element={<AddCourse />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
