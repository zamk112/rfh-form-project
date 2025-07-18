import { ErrorMessage } from "@hookform/error-message";
import { useFormContext } from "react-hook-form";
import type { JSX } from "react";
import "./FormComponentUtilities.css";


export const withErrorDisplayHoC = <P extends { name: string }>(Component: React.ComponentType<P>) => {
    return (props: P): JSX.Element => {
        const { formState: { errors } } = useFormContext();
        
        return (
            <div className="form-field-wrapper">
                <Component {...props} />
                <ErrorMessage 
                    name={props.name} 
                    errors={errors} 
                    render={({ message }) => <span className="error-display">{message}</span>} 
                />
            </div>
        );
    };
};
