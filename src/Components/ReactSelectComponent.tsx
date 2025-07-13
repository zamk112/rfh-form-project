import { Controller, useFormContext } from "react-hook-form";
import ReactSelect, { type GroupBase, type MultiValue, type SingleValue } from "react-select";
import type { IOptionType,  IReactSelectComponentProp, IReactSelectGroupedComponentProp } from "../Interfaces/IReactSelectComponentProps";
import "./ReactSelectComponent.css";

export const ReactSelectComponent = <TOption extends IOptionType, TGroup extends GroupBase<TOption>>(
{ 
    name, 
    className, 
    labelDescription, 
    options, 
    isMulti, 
    pageSize, 
    rules, 
    formatGroupLabelProp 
}: IReactSelectComponentProp<TOption> | IReactSelectGroupedComponentProp<TOption, TGroup>) => {
    const { control } = useFormContext();

    const formatGroupLabel = (data: TGroup) => (
        <>
            <span>{data.label}</span>
            <span>{data.options.length}</span>
        </>
    );

    const isGroupOption = (item: TOption | TGroup): item is TGroup => {
        return item != null && 
            typeof item === 'object' && 
            'label' in item &&
            'options' in item && 
            Array.isArray((item).options);
    };

    const getAllOptions = (): TOption[] => {
        const allOptions: TOption[] = [];
        
        options.forEach((option) => {
            if (isGroupOption(option)) {
                allOptions.push(...option.options);
            } else {
                allOptions.push(option as TOption);
            }
        });

        return allOptions;
    };

    const allOptions = getAllOptions();
    const isGrouped = options.length > 0 && options.every(option => isGroupOption(option));
    
    return (
        <div className={className ?? 'form-field'}>
            <label htmlFor={name}>{labelDescription}</label>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) => (
                    <ReactSelect<TOption, boolean, TGroup>
                        {...field}
                        id={name}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={options}
                        isMulti={isMulti}
                        pageSize={pageSize}
                        formatGroupLabel={isGrouped ? (formatGroupLabelProp ?? formatGroupLabel) : undefined}
                        value={ 
                            isMulti
                                ? allOptions.filter(option => 
                                    Array.isArray(field.value) && field.value.includes(option.value)
                                  ) || []
                                : allOptions.find(option => option.value === field.value) || null
                        }
                        onChange={
                            (userSelectionData: SingleValue<TOption> | MultiValue<TOption> | null | []): void => {
                                if (isMulti) {
                                    const values = (userSelectionData as MultiValue<TOption>)?.map(option => option.value) || [];
                                    field.onChange(values);
                                }
                                else {
                                    const value = (userSelectionData as SingleValue<TOption>)?.value || null;
                                    field.onChange(value);
                                }
                            }}
                    />
                )}
            />
        </div>
    )

}