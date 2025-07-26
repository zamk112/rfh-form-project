import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { IOptionType, IReactSelectComponentProp, IReactSelectGroupedComponentProp, IReactSelectGroupProp } from "../Interfaces/IReactSelectComponentProps";
import { FormComponent } from "../Components/FormComponents";
import { ReactSelectComponent, ReactSelectComponentWithError } from "../Components/ReactSelectComponent";
import userEvent from "@testing-library/user-event";

describe('ReactSelectComponent', () => {
    const basicSelectProps: IReactSelectComponentProp<IOptionType> = {
        name: 'favLang',
        labelDescription: 'Favourite Language',
        options: [
            { value: 'js', label: 'JavaScript' },
            { value: 'ts', label: 'TypeScript' },
            { value: 'py', label: 'Python' },
        ]
    };

    it('renders single select with options', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <ReactSelectComponent {...basicSelectProps} />
            </FormComponent>
        );

        expect(screen.getByLabelText('Favourite Language')).toBeInTheDocument();
        expect(screen.getByText('Select...')).toBeInTheDocument();
    });

    it('opens dropdown and shows options when clicked', async () => {
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <ReactSelectComponent {...basicSelectProps} />
            </FormComponent>
        );

        const selectControl = screen.getByText('Select...');
        await user.click(selectControl);

        expect(screen.getByText('JavaScript')).toBeInTheDocument();  
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();  
    });

    it('handles single selection', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <ReactSelectComponent {...basicSelectProps} />
            </FormComponent>
        );

        const selectControl = screen.getByText('Select...');
        
        await user.click(selectControl);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();  

        await user.click(screen.getByText('JavaScript'));
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
        expect(screen.queryByText('Python')).not.toBeInTheDocument();  

        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ favLang: 'js' }),
            expect.any(Object)
        );
    });

    it('renders multi-select', async () => {
        const multiSelectProps: IReactSelectComponentProp<IOptionType> = {
            ...basicSelectProps,
            name: 'favLangs',
            labelDescription: 'Favourite Languages',
            isMulti: true
        };

        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <ReactSelectComponent {...multiSelectProps} />
            </FormComponent>
        );

        const selectControl = screen.getByLabelText('Favourite Languages');
        await user.click(selectControl);

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();  
        await user.click(screen.getByText('JavaScript'));
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
        expect(screen.queryByText('Python')).not.toBeInTheDocument();  

        await user.click(selectControl);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();  
        await user.click(screen.getByText('TypeScript'));
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.queryByText('Python')).not.toBeInTheDocument();         

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('handles multi-select form submission', async () => {
        const multiSelectProps: IReactSelectComponentProp<IOptionType> = {
            ...basicSelectProps,
            name: 'favLangs',
            labelDescription: 'Favourite Languages',
            isMulti: true
        }; 
        
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <ReactSelectComponent {...multiSelectProps} />
            </FormComponent>            
        );

        const selectControl = screen.getByLabelText('Favourite Languages');

        await user.click(selectControl);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();  
        await user.click(screen.getByText('JavaScript'));
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
        expect(screen.queryByText('Python')).not.toBeInTheDocument();  

        await user.click(selectControl);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();         
        await user.click(screen.getByText('TypeScript'));
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.queryByText('Python')).not.toBeInTheDocument();  

        await user.click(selectControl);
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();          
        await user.click(screen.getByText('Python'));
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('Python')).toBeInTheDocument();        

        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                favLangs: ['js', 'ts', 'py']
            }),
            expect.any(Object)
        );    

    });

    it('renders grouped options', async () => {
        const groupSelectProp: IReactSelectGroupedComponentProp<IOptionType, IReactSelectGroupProp> = {
            name: 'favFramework',
            labelDescription: 'Favourite Framework',
            options: [
                {
                    label: 'Frontend',
                    options: [
                        { label: 'React', value: 'react' },
                        { label: 'Vue', value: 'vue' },
                    ]
                },
                {
                    label: 'Backend',
                    options: [
                        { label: 'Express', value: 'express' },
                        { label: 'FastAPI', value: 'fastapi' },                        
                    ]
                }
            ]     
        };

        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <ReactSelectComponent {...groupSelectProp} />
            </FormComponent>
        );

        const selectControl = screen.getByLabelText('Favourite Framework');
        await user.click(selectControl);

        expect(screen.getByText('Frontend')).toBeInTheDocument();
        expect(screen.getByText('Backend')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
        expect(screen.getByText('Express')).toBeInTheDocument();
        expect(screen.getByText('FastAPI')).toBeInTheDocument();       
    });

    it('handles grouped option selection', async () => {
        const groupSelectProp: IReactSelectGroupedComponentProp<IOptionType, IReactSelectGroupProp> = {
            name: 'favFramework',
            labelDescription: 'Favourite Framework',
            options: [
                {
                    label: 'Frontend',
                    options: [
                        { label: 'React', value: 'react' },
                        { label: 'Vue', value: 'vue' },
                    ]
                },
                {
                    label: 'Backend',
                    options: [
                        { label: 'Express', value: 'express' },
                        { label: 'FastAPI', value: 'fastapi' },                        
                    ]
                }
            ]     
        };
        
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <ReactSelectComponent {...groupSelectProp} />
            </FormComponent>
        );

        const selectControl = screen.getByLabelText('Favourite Framework');
        await user.click(selectControl);

        expect(screen.getByText('Frontend')).toBeInTheDocument();
        expect(screen.getByText('Backend')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
        expect(screen.getByText('Express')).toBeInTheDocument();
        expect(screen.getByText('FastAPI')).toBeInTheDocument();     

        await user.click(screen.getByText('React'));
        expect(screen.queryByText('Frontend')).not.toBeInTheDocument();
        expect(screen.queryByText('Backend')).not.toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.queryByText('Vue')).not.toBeInTheDocument();
        expect(screen.queryByText('Express')).not.toBeInTheDocument();
        expect(screen.queryByText('FastAPI')).not.toBeInTheDocument();     

        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ favFramework: 'react'}),
            expect.any(Object)
        );
    });

    it('displays default selected value', () => {
        render(
            <FormComponent defaultValues={{ favLang: 'js' }} onSubmit={vi.fn()}>
                <ReactSelectComponent {...basicSelectProps} />
            </FormComponent>
        );

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('displays default selected values for multi-select', () => {
        const multiSelectProps: IReactSelectComponentProp<IOptionType> = {
            ...basicSelectProps,
            name: 'favLangs',
            labelDescription: 'Favourite Languages',
            isMulti: true
        };

        render(
            <FormComponent defaultValues={{ favLangs: ['js', 'ts'] }} onSubmit={vi.fn()}>
                <ReactSelectComponent {...multiSelectProps} />
            </FormComponent>
        );

        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
    });

    it('handles clearing selection', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{ favLang: 'js' }} onSubmit={mockSubmit}>
                <ReactSelectComponent {...basicSelectProps} />
            </FormComponent>            
        );

        await user.click(screen.getByRole('button', { name: /reset/i }));
        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ favLang: 'js' }),
            expect.any(Object)
        )
    });

    it('validates required field', async () => {
        const requiredSelectProps: IReactSelectComponentProp<IOptionType> = {
            ...basicSelectProps,
            rules: { required: 'This field is required' }
        };

        const mockSubmit = vi.fn();
        const user = userEvent.setup();
        
        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <ReactSelectComponentWithError {...requiredSelectProps} />
            </FormComponent>
        );

        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(screen.getByText('This field is required')).toBeInTheDocument();
        expect(mockSubmit).not.toHaveBeenCalled();
    });
});
