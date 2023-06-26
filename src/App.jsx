import Header from './components/Header'
import Register from './components/Register'
import {Routes,Route} from 'react-router-dom'
import Home from './components/Home'

function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
      </>
  )
}

export default App
