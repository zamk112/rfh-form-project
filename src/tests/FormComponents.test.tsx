import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormComponent, InputComponent, InputComponentWithError, SelectComponent, SelectComponentWithError } from '../Components/FormComponents';
import type { IInputProp, ISelectProp } from '../Interfaces/IFormComponentsProps';

describe('FormComponent', () => {
    it('renders form with children and submit button', () => {
        const mockSubmit = vi.fn();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <div>Test Child</div>
            </FormComponent>
        );

        expect(screen.getByText('Test Child')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('class onSumbit when form is submitted', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{ test: 'value' }} onSubmit={mockSubmit}>
                <div>Test Child</div>
            </FormComponent>            
        )

        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                { test: 'value' },
                expect.objectContaining({ 
                    type: 'submit',
                    target: expect.any(HTMLFormElement)
                 }),
                // expect.any(Object)
                // expect.anything()
            );
        });
    });

    it('resets form when reset button is clicked', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{ name: 'default' }} onSubmit={mockSubmit}>
                <InputComponent name='name' labelDescription='Name' type='text' />
            </FormComponent>
        );

        const input = screen.getByLabelText('Name');
        await user.clear(input);
        await user.type(input, 'changed value');

        expect(input).toHaveValue('changed value');

        await user.click(screen.getByRole('button', { name: /reset/i }))

        await waitFor(() => {
            expect(input).toHaveValue('default')
        });

    });
});

describe('InputComponent', () => {
    const defaultProps : IInputProp = {
        name: 'testInput',
        labelDescription: 'Test Input',
        type: 'text'
    };

    it('renders text input with label', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <InputComponent {...defaultProps} />
            </FormComponent>
        );

        expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders number input', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <InputComponent name='age' labelDescription='Age' type='number' /> 
            </FormComponent>
        );

        expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
    });

    it('renders password input with autocomplete off', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <InputComponent name='password' labelDescription='Password' type='password' htmlAttributes={{ autoComplete: 'off' }} />
            </FormComponent>
        );

        const input = screen.getByLabelText('Password');
        expect(input).toHaveAttribute('type', 'password');
        expect(input).toHaveAttribute('autocomplete', 'off');
    });

    it('renders range input with min, max, and step attributes', () => {
        render(
            <FormComponent defaultValues={{ loudness: 50}} onSubmit={vi.fn()}>
                <InputComponent name='loudness' labelDescription='Loudness' type='range' htmlAttributes={{ min: 0, max: 100, step: 2}} />
            </FormComponent>
        );

        const input = screen.getByLabelText('Loudness');
        expect(input).toHaveAttribute('type', 'range');
        expect(input).toHaveAttribute('min', '0');
        expect(input).toHaveAttribute('max', '100');
        expect(input).toHaveAttribute('step', '2');
        expect(input).toHaveValue('50');

    });

    it('should handle range input value changes', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{ loudness: 50 }} onSubmit={mockSubmit}>
                <InputComponent name='loudness' labelDescription='Loudness' type='range' htmlAttributes={{ min: 0, max: 100, step: 2}} />
            </FormComponent>
        );
        
        const input = screen.getByLabelText('Loudness');
        expect(input).toHaveValue('50');

        fireEvent.change(input, { target: { value: 80 }});
        expect(input).toHaveValue('80');
        
        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalledWith(
            //expect.objectContaining({ loudness: '80' }),
            expect.objectContaining({ loudness: 80 }),
            expect.anything()
        );
    });

    it('should handle range input boundary values', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{ loudness: 50 }} onSubmit={mockSubmit}>
                <InputComponent name='loudness' labelDescription='Loudness' type='range' htmlAttributes={{ min: 0, max: 100, step: 2}} />
            </FormComponent>
        );
        
        const input = screen.getByLabelText('Loudness');
        
        fireEvent.change(input, { target: { value: 0 }});
        expect(input).toHaveValue('0');

        fireEvent.change(input, { target: { value: 90 }});
        expect(input).toHaveValue('90');

        await user.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ loudness: 90 }),
            expect.anything()
        );
    });
});

describe('InputComponentWithError', () => {
    it('shows validation error for required field', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <InputComponentWithError 
                    name='required' 
                    labelDescription='Required Field' 
                    type='text'
                    rules={{ required: 'This field is required' }} />
            </FormComponent>
        );

        await user.click(screen.getByRole('button', { name: /submit/i }));
        
        await waitFor(() => {
            expect(screen.getByText('This field is required')).toBeInTheDocument();
        });

        expect(mockSubmit).not.toHaveBeenCalled();
    });

    it('handles custom validation rules (Password)', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <InputComponentWithError
                    name='password'
                    labelDescription='Password' 
                    type='password'
                    rules={{
                        validate: (value: string) => {
                            if (!value || value.length < 8)
                            {
                                return "Password must be at least 8 characters";
                            }
                            return true;
                        }
                    }}/>
            </FormComponent>
        );

        const input = screen.getByLabelText('Password');
        await user.type(input, 'short');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
        });
    });
});

describe('InputComponent - Checkbox', () => {
    const favMusicProps: IInputProp = {
        name: 'favMusic',
        labelDescription: 'Favourite Music',
        type: 'checkbox',
        optionsProp: {
            options: [
                { value: 'rap', label: 'Rap' },
                { value: 'hiphop', label: 'Hip Hop' },
                { value: 'rnb', label: 'RnB' }
            ],
        },
    };

    it('renders checkbox group with options', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <InputComponent {...favMusicProps} />
            </FormComponent>
        );

        expect(screen.getByRole('group')).toBeInTheDocument();
        expect(screen.getByText('Favourite Music')).toBeInTheDocument();
        expect(screen.getByLabelText('Rap')).toBeInTheDocument();
        expect(screen.getByLabelText('Hip Hop')).toBeInTheDocument();
        expect(screen.getByLabelText('RnB')).toBeInTheDocument();
    });

    it('handles checkbox selection', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <InputComponent {...favMusicProps} />
            </FormComponent>
        );
        
        await user.click(screen.getByLabelText('Rap'));
        await user.click(screen.getByLabelText('Hip Hop'));
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    favMusic: ['rap', 'hiphop']
                }),
                expect.anything()
            );
        });
    });

    it('handles checkbox delection', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{ favMusic: ['rap', 'hiphop'] }} onSubmit={mockSubmit}>
                <InputComponent {...favMusicProps} />
            </FormComponent>
        );

        await user.click(screen.getByLabelText('Rap'));
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ favMusic: ['hiphop'] }),
                expect.anything()
            );
        });
    });
});

describe('InputComponent - Radio', () => {
    const favColorProps: IInputProp = {
        name: 'favColor',
        labelDescription: 'Favourite Color',
        type: 'radio',
        optionsProp: {
            options: [
                { value: 'blue', label: 'Blue' },
                { value: 'red', label: 'Red' },
                { value: 'green', label: 'Green' }
            ],
        },
    };

    it('renders radio group with options', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <InputComponent {...favColorProps} />
            </FormComponent>
        );

        expect(screen.getByRole('group')).toBeInTheDocument();
        expect(screen.getByText('Favourite Color')).toBeInTheDocument();
        expect(screen.getByLabelText('Blue')).toBeInTheDocument();
        expect(screen.getByLabelText('Red')).toBeInTheDocument();
        expect(screen.getByLabelText('Green')).toBeInTheDocument();    
    });

    it('handles radio selection', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <InputComponent {...favColorProps} />
            </FormComponent>
        );

        await user.click(screen.getByLabelText('Blue'));
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ favColor: 'blue' }),
                expect.anything()
            );
        });
    });
});

describe('SelectComponent', () => {
    const genderProps: ISelectProp = {
        name: 'gender',
        labelDescription: 'Gender',
        options: [
            { value: '', label: '' },
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' }
        ],
    };

    it('renders select with options', () => {
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <SelectComponent {...genderProps} />
            </FormComponent>
        );

        expect(screen.getByLabelText('Gender')).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Male' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Female' })).toBeInTheDocument();
    });

    it('handles select option change', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <SelectComponent {...genderProps} />
            </FormComponent>
        );
        
        await user.selectOptions(screen.getByLabelText('Gender'), 'M');
        await user.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ gender: 'M'}),
                expect.anything()
            );
        });
    });

    it('renders select with optgroups', () => {
        const favCarProp: ISelectProp = {
            name: 'favCar',
            labelDescription: 'Favourite Car',
            options: [
            { value: '', label: '' },
            {
                optGroup: 'Toyota', iSelectOptions: [
                { value: 'toyota-86', label: '86' },
                { value: 'toyota-mr2', label: 'MR2' },
                { value: 'toyota-supra', label: 'Supra' },
                { value: 'toyota-chaser', label: 'Chaser' },
                { value: 'toyota-celica', label: 'Celica' },
                { value: 'toyota-mrs', label: 'MRS' },
                ]
            },
            {
                optGroup: 'Nissan', iSelectOptions: [
                { value: 'nissan-skyline', label: 'Skyline' },
                { value: 'nissan-silvia', label: 'Silvia' },
                { value: 'nissan-350z', label: '350Z' },
                { value: 'nissan-370z', label: '370Z' },
                { value: 'nissan-400Z', label: '400Z' },
                { value: 'nissan-pulsar', label: 'Pulsar' },
                { value: 'nissan-pulsar-sss', label: 'Pulsar SSS' },
                { value: 'nissan-pulsar-gtir', label: 'Pulsar GTIR' },
                ]
            },
            { value: 'go-kart', label: 'Gokart' }
            ],
        };
        
        render(
            <FormComponent defaultValues={{}} onSubmit={vi.fn()}>
                <SelectComponent {...favCarProp} />
            </FormComponent>
        );
        
        expect(screen.getByRole('group', { name: 'Toyota' })).toBeInTheDocument();
        expect(screen.getByRole('group', { name: 'Nissan' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: '86' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Supra' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Skyline' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Silvia' })).toBeInTheDocument();      
    });

    it('handles multiple select', async () => {
        const favPetsProps: ISelectProp = {
        name: 'favPets',
        labelDescription: 'Favourite Pets',
        multiple: true,
        size: 4,
        options: [
            { value: 'dog', label: 'Dog' },
            { value: 'cat', label: 'Cat' },
            { value: 'parrot', label: 'Parrot' },
        ],
        };

        const mockSubmit = vi.fn();
        const user = userEvent.setup();
        
        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <SelectComponent {...favPetsProps} />
            </FormComponent>
        );

        const select = screen.getByLabelText('Favourite Pets');
        await user.selectOptions(select, ['dog', 'cat']);
        await user.click(screen.getByRole('button', { name: /submit/i }));
        
        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledWith(
                expect.objectContaining({ favPets: ['dog', 'cat'] }),
                expect.anything()
            );
        });
    })    
});

describe('SelectComponentWithError', () => {
    const genderProps: ISelectProp = {
        name: 'gender',
        labelDescription: 'Gender',
        options: [
            { value: '', label: '' },
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' }
        ],
        rules: { required: 'Gender is required' }
    };
    
    it('shows validation error for required select', async () => {
        const mockSubmit = vi.fn();
        const user = userEvent.setup();

        render(
            <FormComponent defaultValues={{}} onSubmit={mockSubmit}>
                <SelectComponentWithError {...genderProps} />
            </FormComponent>
        );
        
        await user.click(screen.getByRole('button', { name: /submit/i }));
        
        await waitFor(() => {
            expect(screen.getByText('Gender is required')).toBeInTheDocument();
        });

        expect(mockSubmit).not.toHaveBeenCalled();        
    });

});