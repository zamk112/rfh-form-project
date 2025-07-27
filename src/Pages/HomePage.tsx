import { useEffect, type JSX } from "react";

const Home = (): JSX.Element => {

    useEffect(() => {
        const handleHomePageClicks = (e: Event) => {
            const target = e.target as HTMLAnchorElement;

            if (target.tagName === 'A' && target.href)
            {
                const href = target.getAttribute('href');
                
                if (href === '/sync-form')
                {
                    e.preventDefault();
                    window.history.pushState({}, '', '/sync-form');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
                else if (href === '/async-form')
                {
                    e.preventDefault();
                    window.history.pushState({}, '', '/async-form');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }
            }
        };

        document.addEventListener('click', handleHomePageClicks);
        
        return () => document.removeEventListener('click', handleHomePageClicks);
    }, []);

    return(
        <div>
            <h1>React Hook Form CheatSheet</h1>
            <a href="/sync-form">Synchronous Form Page</a>
            <a href="/async-form">Asynchronous Form Page</a>
        </div>
    );
};

export default Home;