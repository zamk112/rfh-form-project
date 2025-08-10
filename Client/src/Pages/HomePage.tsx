import { type JSX } from "react";
import './HomePage.css';

const Home = (): JSX.Element => {

    return (
        <div className="home-container">
            <h1>React Hook Form Cheat Sheet</h1>
            <div className="content-container">
                <p>Components are in files:</p>
                <ul>
                    <li><i>Form Components</i>: <code>/src/Components/FormComponents.tsx</code></li>
                    <li><i><code>react-select</code> Component</i>: <code>/src/Components/ReactSelectComponent.tsx</code></li>
                </ul>               
            </div>
            <div className="nav-container">
                <div className="sync-form">
                    <a href="/sync-form">Synchronous Form Page</a>
                    <p>Created components with <b>Synchronous</b> behaviour.</p>
                    <p>See in <code>/src/Pages/SyncFormPage.tsx</code> for how the from is setup.</p>
                </div>
                <div className="async-form">
                    <a href="/async-form">Asynchronous Form Page</a>
                    <p>Created components with <b>Asynchronous</b> behaviour.</p>
                    <p>See in <code>/src/Pages/AsyncFormPage.tsx</code> for how the from is setup.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;