import { useEffect, useState, type JSX } from "react";
import "./App.css";
import SyncFormPage from "./Pages/SyncFormPage";
import Home from "./Pages/HomePage";
import AsyncFormPage from "./Pages/AsyncFormPage";
import LayoutComponent from "./Layouts/Layout";
import type { TAppPagesProp } from "./Types/AppTypesProps";

function App() {
  const [currentPage, setCurrentPage] = useState<TAppPagesProp>("home");

  const getPageFromPath = (path: string): TAppPagesProp => {
    if (path === '/sync-form') return 'SyncFormPage';
    if (path == '/async-form') return 'AsyncFormPage';
    return 'home';
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, page: TAppPagesProp): void => {
    e.preventDefault();
    
    let path = '/';
    if (page === 'SyncFormPage') path = '/sync-form';
    if (page == 'AsyncFormPage') path = '/async-form';

    window.history.pushState({}, '', path);
    setCurrentPage(page)
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
          <a href="#" onClick={(e) => handleNavClick(e, 'home')} className={currentPage === 'home' ? 'active': ''}>Home</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'SyncFormPage')} className={currentPage === 'SyncFormPage' ? 'active': ''}>Synchronous Form Page</a>
          <a href="#" onClick={(e) => handleNavClick(e, 'AsyncFormPage')} className={currentPage === 'AsyncFormPage' ? 'active': ''}>Asynchronous Form Page</a>
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
