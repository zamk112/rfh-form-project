import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormComponent, InputComponent } from '../Components/FormComponents';

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

