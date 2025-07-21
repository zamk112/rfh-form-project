import { Controller, FormProvider, useForm, useFormContext, type DefaultValues, type FieldValues } from "react-hook-form";
import type { IFormProp, IInputProp, ISelectOptGroup, ISelectOption, ISelectProp } from "../Interfaces/IFormComponentsProps";
import type { JSX } from "react";
import { withErrorDisplayHoC } from "./FormComponentUtilities";
import './FormComponents.css';

export const FormComponent = <T extends FieldValues>({ children, defaultValues, onSubmit, htmlAttributes }: IFormProp<T>): JSX.Element => {
    const methods = useForm<T>({ defaultValues: defaultValues as DefaultValues<T> });
    const { handleSubmit, reset } = methods;

    return (
        <FormProvider {...methods}>
            <form {...htmlAttributes} onSubmit={handleSubmit(onSubmit)}>
                {children}
                <div className="button-group">
                    <input type="submit" />
                    <button type="button" onClick={() => reset(defaultValues)}>Reset</button>
                </div>
            </form>
        </FormProvider>
    );
}

export const InputComponent = ({ name, className, labelDescription, type, optionsProp, rules, htmlAttributes }: IInputProp): JSX.Element => {
    const { /* register, */ control } = useFormContext();

    if ((type === 'checkbox' || type === 'radio') && optionsProp) {
        return (
            <fieldset className={className ?? (type === 'checkbox' ? 'form-field checkbox-group' : 'form-field radio-group')}>
                <legend>{labelDescription}</legend>
                <Controller
                    control={control}
                    name={name}
                    rules={{ ...rules }}
                    render={({ field }) => (
                        <div className={optionsProp.optClassName ?? (type === 'checkbox' ? 'checkbox-options' : 'radio-options')}>
                            {optionsProp.options.map((option) => {
                                const inputId = `${name}-${option.value}`;
                                const isChecked = type === 'checkbox'
                                    ? (field.value || []).includes(option.value)
                                    : field.value == option.value;
                                return (
                                    <div key={option.value} className={option.className ?? (type === 'checkbox' ? 'checkbox-option' : 'radio-option')}>
                                        <input
                                            id={inputId}
                                            type={type}
                                            value={option.value ?? ''}
                                            disabled={option.disabled}
                                            checked={isChecked}
                                            {...htmlAttributes}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                if (type === 'checkbox') {
                                                    const currentValues = field.value || [];
                                                    if (e.target.checked) {
                                                        field.onChange([...currentValues, option.value]);
                                                    }
                                                    else {
                                                        field.onChange(currentValues.filter((val: typeof option.value) => val != option.value))
                                                    }
                                                }
                                                else {
                                                    field.onChange(option.value);
                                                }
                                            }}
                                        />
                                        <label htmlFor={inputId}>{option.label}</label>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                />
            </fieldset>
        )
    }

    return (
        <div className={className ?? 'form-field'}>
            <label htmlFor={name}>{labelDescription}</label>
            <Controller
                control={control}
                name={name}
                rules={{ ...rules }}
                render={({ field }) => (
                    <input 
                        {...field} 
                        id={name} 
                        type={type} 
                        {...htmlAttributes} 
                        value={field.value as string | number ?? ""} 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            { 
                                if (['number', 'range'].includes(type)) 
                                    field.onChange(Number(e.target.value)); // field.onChange(e.target.valueAsNumber);
                                // else if (['date', 'time', 'datetime-local', 'week', 'month'].includes(type))
                                //     field.onChange(e.target.valueAsDate)
                                else
                                    field.onChange(e.target.value);
                            } 
                        }
                    />
                )}
            />
            {/* <input type={type} 
                    {...register(name, { required: required?.required ? required.requiredMessage  : false })} /> */}
        </div>
    )
}

export const SelectComponent = ({ name, className, labelDescription, options, multiple, size, rules, htmlAttributes }: ISelectProp): JSX.Element => {
    const { control } = useFormContext();

    const renderOptions = () => {
        if (!options)
            return null;

        return options.map((item) => {
            if ('iSelectOptions' in item) {
                const group = item as ISelectOptGroup;
                return (
                    <optgroup key={group.optGroup} label={group.optGroup} disabled={group.disabled} {...group.htmlAttributes}>
                        {group.iSelectOptions.map((option) => (
                            <option key={option.value} value={option.value} disabled={option.disabled} {...option.htmlAttributes}>
                                {option.label}
                            </option>
                        ))}
                    </optgroup>
                )
            }
            else {
                const option = item as ISelectOption;
                return (
                    <option key={option.value} value={option.value} disabled={option.disabled} {...option.htmlAttributes}>
                        {option.label}
                    </option>
                )
            }
        });
    };

    return (
        <div className={className ?? 'form-field'}>
            <label htmlFor={name}>{labelDescription}</label>
            <Controller
                control={control}
                name={name}
                rules={{ ...rules }}
                render={({ field }) => (
                    <select
                        {...field}
                        id={name}
                        multiple={multiple}
                        size={size}
                        {...htmlAttributes}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                            if (multiple) {
                                const selectedValues = Array.from(e.target.selectedOptions)
                                    .map(option => option.value);
                                field.onChange(selectedValues);
                            }
                            else {
                                field.onChange(e.target.value);
                            }

                        }}
                        value={field.value ?? (multiple ? [] : '')}
                    >
                        {renderOptions()}
                    </select>
                )}
            />
        </div>
    );
}

export const InputComponentWithError = withErrorDisplayHoC(InputComponent);
export const SelectComponentWithError = withErrorDisplayHoC(SelectComponent);