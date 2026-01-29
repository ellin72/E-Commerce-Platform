import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
    it('should return true for a simple assertion', () => {
        expect(true).toBe(true);
    });

    it('should render the component correctly', () => {
        const element = document.createElement('div');
        element.textContent = 'Hello, World!';
        expect(element.textContent).toBe('Hello, World!');
    });
});