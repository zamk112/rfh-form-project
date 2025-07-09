import { Controller, useFormContext } from "react-hook-form";
import ReactSelect, { type MultiValue, type SingleValue } from "react-select";
import type { IReactSelectComponentProp } from "../Interfaces/IReactSelectComponentProps";
import { type OptionType } from "../Types/TReactSelectProps";

export const ReactSelectComponent = <T extends OptionType = OptionType>({ name, className, labelDescription, options, isMulti, pageSize, rules }: IReactSelectComponentProp<T>) => {
    const { control } = useFormContext();

    return (
        <div className={className ?? 'form-field'}>
            <label htmlFor={name}>{labelDescription}</label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <ReactSelect<T, boolean>
                        {...field}
                        id={name}
                        options={options}
                        isMulti={isMulti}
                        pageSize={pageSize}
                        value={
                            isMulti
                                ? options.filter(option => Array.isArray(field.value) && field.value.includes(option.value)) || []
                                : options.find(option => option.value === field.value) || null
                        }
                        onChange={
                            (userSelectionData: SingleValue<T> | MultiValue<T> | null | []): void => {
                                if (isMulti) {
                                    const values = (userSelectionData as MultiValue<T>)?.map(option => option.value) || [];
                                    field.onChange(values);
                                }
                                else {
                                    const value = (userSelectionData as SingleValue<T>)?.value || null;
                                    field.onChange(value);
                                }
                            }}
                    />
                )}
            />
        </div>
    )

}