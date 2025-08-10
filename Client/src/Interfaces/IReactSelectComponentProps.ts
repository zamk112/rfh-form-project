import type { RegisterOptions } from "react-hook-form";
import type { GroupBase } from "react-select";
// import type { GroupOptionType, OptionType } from "../Types/TReactSelectProps";

export interface IOptionType {
    value: string | number;
    label: string;
}

export interface IReactSelectBaseProps {
    name: string;
    labelDescription: string;
    rules?: RegisterOptions;
    isMulti?: boolean;
    className?: string;
    pageSize?: number;
    formatGroupLabelProp?: (data: unknown) => React.ReactNode;
}

export interface IReactSelectComponentProp<TOption extends IOptionType> extends IReactSelectBaseProps {
    options: TOption[];
}

export interface IReactSelectGroupedComponentProp<TOption extends IOptionType, TGroup extends GroupBase<TOption>> extends IReactSelectBaseProps {
    options: TGroup[];
}

export interface IReactSelectGroupProp extends GroupBase<IOptionType> {
    label: string;
    options: IOptionType[];
}