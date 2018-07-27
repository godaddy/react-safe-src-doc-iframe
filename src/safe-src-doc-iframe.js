import React, { Component } from 'react';
import PropTypes from 'prop-types';

const disableStylesRaw = `
  *[href], button, img {
    pointer-events: none !important;
    display: inline-block !important;
  }
`;

class SafesrcDocIframe extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    srcDoc: PropTypes.string.isRequired,
    sandbox: PropTypes.string,
    referrerPolicy: PropTypes.string,
    src: PropTypes.string
  };

  static defaultProps = {
    // set all restrictions for sandbox except same origin
    // to allow us to inject the safe guards.
    sandbox: 'allow-same-origin',
    referrerPolicy: 'no-referrer',
    // will be omitted from props passed to the iframe
    src: ''
  };

  constructor(...args) {
    super(...args);
    this.iframeElement = null;
    this.disableStyleTag = document.createElement('style');
    this.disableStylesTextNode = document.createTextNode(disableStylesRaw);
    this.disableStyleTag.appendChild(this.disableStylesTextNode);
  }

  componentDidMount() {
    if (this.iframeElement) {
      this.iframeElement.onload = () => {
        this.applySafeguards();
      };
    }
  }

  componentWillUnmount() {
    this.disableStylesTextNode = null;
    this.disableStyleTag = null;
  }

  applySafeguards() {
    if (!this.iframeElement.contentDocument) {
      return;
    }
    const [
      iframeBody
    ] = this.iframeElement.contentDocument.getElementsByTagName('body');
    if (iframeBody) {
      // add safety guards last to ensure they are always applied.
      iframeBody.appendChild(this.disableStyleTag);
    }
  }

  render() {
    const {
      title,
      referrerPolicy,
      sandbox,
      srcDoc,
      src: omit, /* eslint-disable-line no-unused-vars */
      ...rest
    } = this.props;
    return (
      <iframe
        title={ title }
        srcDoc={ srcDoc }
        referrerPolicy={ referrerPolicy }
        sandbox={ sandbox }
        ref={ el => {
          this.iframeElement = el;
        } }
        { ...rest }
      />
    );
  }
}

export default SafesrcDocIframe;
