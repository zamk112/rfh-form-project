import { useEffect, useState, type JSX } from "react";
import "./App.css";
import SyncFormPage from "./Pages/SyncFormPage";
import Home from "./Pages/HomePage";
import AsyncFormPage from "./Pages/AsyncFormPage";
import LayoutComponent from "./Layouts/Layout";
import type { TAppPagesProp } from "./Types/TAppProps";

function App() {
  const [currentPage, setCurrentPage] = useState<TAppPagesProp>("home");

  const getPageFromPath = (path: string): TAppPagesProp => {

    switch(path)
    {
      case "/":
        return "home";
      case "/sync-form":
        return "SyncFormPage";
      case "/async-form":
        return "AsyncFormPage";
      default:
        return "home";
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault();
    
    const href = e.currentTarget.getAttribute('href')!;

    window.history.pushState({}, '', href);
    setCurrentPage(getPageFromPath(href));
  };

  useEffect(() => {
    const updatePageFromURL = ():void => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };

    updatePageFromURL();

    window.addEventListener('popstate', updatePageFromURL);
    return ():void => window.removeEventListener('popstate', updatePageFromURL);
  }, []);

  const RenderPage = (): JSX.Element => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "SyncFormPage":
        return <SyncFormPage />;
      case "AsyncFormPage":
        return <AsyncFormPage />;
      default:
        return <Home />;
    }
  };

  const NavBar = (): JSX.Element => {
    return(
      <>
        <nav>
          <a href="/" onClick={(e) => handleNavClick(e)} className={currentPage === 'home' ? 'active': ''}>Home</a>
          <a href="/sync-form" onClick={(e) => handleNavClick(e)} className={currentPage === 'SyncFormPage' ? 'active': ''}>Synchronous Form Page</a>
          <a href="/async-form" onClick={(e) => handleNavClick(e)} className={currentPage === 'AsyncFormPage' ? 'active': ''}>Asynchronous Form Page</a>
        </nav>
      </>
    );
  };

  return (
    <>
      {currentPage === 'home' ? (<RenderPage />) : (<LayoutComponent NavBar={<NavBar />} Main={<RenderPage />} />)}
    </>
  );
}

export default App;
