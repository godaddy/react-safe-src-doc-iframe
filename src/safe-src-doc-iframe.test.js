import React from 'react';
import { shallow, mount } from 'enzyme';
import SafeSrcDocIframe from './safe-src-doc-iframe';

describe('<SafeSrcDocIframe />', () => {
  const mockDocument = `
  <!DOCTYPE html>
  <html>
    <head></head>
    <body>
      mock html page
    </body>
  </html>
  `;

  const testIframe = () => <SafeSrcDocIframe title='some-title' srcDoc={ mockDocument } />;

  const renderShallowSafeframe = () => {
    return shallow(testIframe());
  };

  const renderMountedSafeIframe = () => {
    return mount(testIframe());
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders as expected', () => {
    expect(
      renderShallowSafeframe()
    ).toMatchSnapshot();
  });
  it('will not configure onload for iframe during componentDidMount if ref does not exist', () => {
    const wrapper = renderMountedSafeIframe();
    expect(() =>
      wrapper.instance().componentDidMount.call({})
    ).not.toThrow();
  });
  it('will configure onload for iframe', () => {
    const applySafeguardsSpy = jest.spyOn(
      SafeSrcDocIframe.prototype,
      'applySafeguards'
    );
    const wrapper = renderMountedSafeIframe();
    expect(wrapper.instance().iframeElement.onload).toBeDefined();
    wrapper.instance().iframeElement.onload();
    expect(applySafeguardsSpy).toHaveBeenCalled();
  });
  it('will not apply safeguard styles if contentDocument does not exist', () => {
    const wrapper = renderMountedSafeIframe();
    const disableStyleTag = document.createElement('style');
    expect(() =>
      wrapper.instance().applySafeguards.call({
        iframeElement: {},
        disableStyleTag
      })
    ).not.toThrow();
  });
  it('will not apply safeguard styles if contentDocument.body does not exist', () => {
    const wrapper = renderMountedSafeIframe();
    const disableStyleTag = document.createElement('style');
    const mockContentDocument = {
      getElementsByTagName: jest.fn().mockReturnValue([])
    };
    expect(() =>
      wrapper.instance().applySafeguards.call({
        iframeElement: {
          contentDocument: mockContentDocument
        },
        disableStyleTag
      })
    ).not.toThrow();
    expect(mockContentDocument.getElementsByTagName).toHaveBeenCalledWith(
      'body'
    );
  });
  it('will apply safeguard styles if contentDocument and contentDocument.body exists', () => {
    const wrapper = renderMountedSafeIframe();
    const mockBody = {
      appendChild: jest.fn()
    };
    const mockContentDocument = {
      getElementsByTagName: jest.fn().mockReturnValue([mockBody])
    };
    const disableStyleTag = document.createElement('style');
    wrapper.instance().applySafeguards.call({
      iframeElement: {
        contentDocument: mockContentDocument
      },
      disableStyleTag
    });
    expect(mockBody.appendChild).toHaveBeenCalledWith(disableStyleTag);
  });
  it('will dereference the style tag and text node when the component will unmount', () => {
    const wrapper = renderMountedSafeIframe();
    expect(wrapper.instance().disableStyleTag).toBeDefined();
    expect(wrapper.instance().disableStylesTextNode).toBeDefined();
    wrapper.instance().componentWillUnmount();
    expect(wrapper.instance().disableStyleTag).toBe(null);
    expect(wrapper.instance().disableStylesTextNode).toBe(null);
    wrapper.unmount();
  });
});
