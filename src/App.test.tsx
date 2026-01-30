import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    expect(
      getByText('Your one-stop shop for all your needs. Quality products, great prices.')
    ).toBeInTheDocument();
  });
});
