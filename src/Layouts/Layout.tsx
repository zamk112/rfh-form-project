import type { JSX } from "react";

const LayoutComponent = ({ NavBar, Main }: { NavBar: React.ReactNode, Main: React.ReactNode }): JSX.Element => {

    return(
        <>
            <div className="navbar">
                {NavBar}
            </div>
            <main>
                {Main}
            </main>
        </>
    );
};

export default LayoutComponent;