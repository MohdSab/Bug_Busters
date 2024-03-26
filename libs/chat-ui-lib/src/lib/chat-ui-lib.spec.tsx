import { render } from '@testing-library/react';

import ChatUiLib from './chat-ui-lib';

describe('ChatUiLib', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChatUiLib />);
    expect(baseElement).toBeTruthy();
  });
});
