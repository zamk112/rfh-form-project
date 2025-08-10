import type { FormHTMLAttributes, InputHTMLAttributes, OptgroupHTMLAttributes, OptionHTMLAttributes, SelectHTMLAttributes } from "react";
import type { RegisterOptions, SubmitHandler } from "react-hook-form";

export interface IFormProp<T> {
    children: React.ReactNode;
    defaultValues?: T;
    onSubmit: SubmitHandler<T>;
    htmlAttributes?: Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>
};

export interface IFormChildrenProp {
    name: string;
    className?: string;
    labelDescription: string;
    rules?: RegisterOptions;
    htmlAttributes?: unknown;
};

export interface IInputProp extends IFormChildrenProp {
    type: string;
    optionsProp?: { options: IInputOptionsProp[], optClassName?: string }
    htmlAttributes?: Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'type' | 'required' | 'value'>
};

export interface ISelectProp extends IFormChildrenProp {
    options: (ISelectOption | ISelectOptGroup)[];
    multiple?: boolean;
    size?: number;
    htmlAttributes?: Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'id' | 'required' | 'value' | 'multiple' | 'size'>
};

export interface IOptionProp {
    value: string | number;
    label: string;
    disabled?: boolean;
    htmlAttributes?: unknown;
};

export interface IInputOptionsProp extends IOptionProp {
    className?: string;
    htmlAttributes?: Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'type' | 'required' | 'value'>
}

export interface ISelectOption extends IOptionProp {
    htmlAttributes?: Omit<OptionHTMLAttributes<HTMLOptionElement>, 'value' | 'label' | 'disabled'>;
};

export interface ISelectOptGroup {
    optGroup: string;
    disabled?: boolean;
    iSelectOptions: ISelectOption[];
    htmlAttributes?: Omit<OptgroupHTMLAttributes<HTMLOptGroupElement>, 'label' | 'disabled'>;
};

export interface IFormResultsProp<T> {
    formValues: T,
    excludeKeys?: (keyof T)[];
    fieldLabels?: Partial<Record<keyof T, string>>;
}

