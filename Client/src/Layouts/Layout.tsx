import type { JSX } from "react";

const LayoutComponent = ({ NavBar, Main }: { NavBar: React.ReactNode, Main: React.ReactNode }): JSX.Element => {

    return(
        <>
            <header>
                {NavBar}
            </header>
            <main>
                {Main}
            </main>
        </>
    );
};

export default LayoutComponent;