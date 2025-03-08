/**
 * Add a stylesheet to a shadowRoot.
 * 
 * @param {string} style - The styles as a string.
 * @param {ShadowRoot} shadowRoot - Refferens to the shadowRoot the style should be added to.
 * 
 * @returns {bool} - True if the opperation was succesfull False if it failed. 
 */
export function addStylesheetToShadowRoot(style, shadowRoot) {
  try {
    const stylesheet = new CSSStyleSheet();
    stylesheet.replaceSync(style);
    shadowRoot.adoptedStyleSheets = [stylesheet];
    return true;
  } catch (e) {
    return false;
  }
}