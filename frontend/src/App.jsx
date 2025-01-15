import {Routes, Route, useLocation} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import Profile from "./pages/Profile.jsx";
import FAQ from "./pages/FAQ.jsx";
import Service from "./pages/Service.jsx";
import Support from "./pages/Support.jsx";
import About from "./pages/About.jsx";
import {useEffect} from "react";
import './index.css';
import Subscriptions from "./pages/Subscriptions.jsx";


function App() {

    const { pathname } = useLocation(); // Получаем текущий путь

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]); // Запускается при каждом изменении пути

    return (
      <Routes>
        <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='subscription/:slug' element={<Service/>} />
            <Route path='subscriptions/' element={<Subscriptions/>} />
            <Route path='support/' element={<Support/>} />
            <Route path='profile/' element={<Profile/>} />
            <Route path='about/' element={<About/>} />
            <Route path='faq/' element={<FAQ/>} />
            <Route path='*' element={<NotFound/>} />
        </Route>
      </Routes>
    )
}

export default App;
