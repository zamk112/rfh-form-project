import type { RegisterOptions } from "react-hook-form";
import type { OptionType } from "../Types/TReactSelectProps";

export interface IReactSelectComponentProp<T extends OptionType = OptionType> {
    name: string;
    labelDescription: string,
    options: T[];
    rules?: RegisterOptions;
    isMulti?: boolean;
    pageSize?: number;
    className?: string
}