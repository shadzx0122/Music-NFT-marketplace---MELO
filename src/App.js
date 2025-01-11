import './App.css';
import {Navbar,Footer} from './frontend/components'
import {Home,Item, Create,Login,Register,Myitem, Trans} from './frontend/pages'
import { Routes, Route } from "react-router-dom";
import { UserProvider } from './frontend/components/context/usercontext';

function App() {

  return (
    <UserProvider>
    <div>
      <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path=":item/:id" element={<Item />} />
            <Route path="/create" element={<Create /> } />
            <Route path="/login" element={ <Login />} />
            <Route path="/register" element={ <Register />} />
            <Route path="/myitem" element={<Myitem />} />
            <Route path="/trans" element={<Trans />} />
          </Routes>
      
      <Footer />
    </div>
    </UserProvider>
  );
}

export default App;
 