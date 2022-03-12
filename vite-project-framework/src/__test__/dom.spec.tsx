import { render } from '@testing-library/react';
import { Header } from '@/components/Header';
import '@testing-library/jest-dom';

describe('testComponent', () => {
  test('render header', async () => {
    const { unmount, getByText, container } = await render(<Header />);
    expect(getByText('Primary Button')).not.toBeEmptyDOMElement();
    unmount();
    expect(container).toBeEmptyDOMElement();
  });
});
