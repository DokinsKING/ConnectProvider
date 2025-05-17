import { Routes, Route } from 'react-router-dom';

import { Navbar } from "./components/Navbar/Navbar"
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { MainPage } from "./pages/MainPage/MainPage";
import { ServiceList } from "./pages/ServiceList/ServiceList";
import { FullServiceCardInfo } from "./pages/FullServiceCardInfo/FullServiceCardInfo";
import { Applications } from "./pages/Applications/Applications";
import { FullApplicationInfo } from "./pages/FullApplicationInfo/FullApplicationInfo";


function App() {
  return (
    <>
      <Navbar/>

      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/services">
          <Route index element={<ServiceList/>}/>
          <Route path=":id" element={<FullServiceCardInfo/>} />
        </Route>
        <Route path="/applications">
          <Route index element={<Applications/>}/>
          <Route path=":id" element={<FullApplicationInfo/>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;