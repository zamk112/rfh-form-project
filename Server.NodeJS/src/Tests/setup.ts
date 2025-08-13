import { vi } from 'vitest'
import type { Request, Response } from 'express';

vi.mock('timers/promises', () => ({
  setTimeout: vi.fn().mockResolvedValue(undefined)
}));

(global as any).testHelpers = {
    createMockRequest: (overrides: Partial<Request> = {}): Partial<Request> => ({
        params: {},
        body: {},
        query: {},
        headers: {},
        ...overrides
    }),
    createMockResponse: (): Partial<Response> => {
        const res: Partial<Response> = {};
        res.status = vi.fn().mockReturnValue(res)
        res.json = vi.fn().mockReturnValue(res)

        return res;
    }
};