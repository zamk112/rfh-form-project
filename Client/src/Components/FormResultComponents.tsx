import type { FieldValues } from "react-hook-form";
import type { IFormResultsProp } from "../Interfaces/IFormComponentsProps";
import { formatKey, formatValue } from "../Utilities/FormResultsHelpers";
import './FormResultComponents.css';

export const FormResultComponent = <T extends FieldValues>({ formValues, excludeKeys, fieldLabels }: IFormResultsProp<T>) => {

    const visibleEntries = Object.entries(formValues).filter(([key, value]) =>
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !excludeKeys?.includes(key as keyof T));

    return (
        <div className="results-panel">
            <div className="results-header">
                <h3>Form Results</h3>
            </div>
            <div className="results-content">
                {visibleEntries.map(([key, value]) =>
                (
                    <div key={key} className="result-item">
                        <span className="result-label">
                            {fieldLabels?.[key as keyof T] || formatKey(key)}:
                        </span>
                        <span className="result-value">{formatValue(value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}