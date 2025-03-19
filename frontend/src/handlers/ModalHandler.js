export default class ModalHandler {
  static #modals = {};

  /**
   * Register a modal.
   * 
   * @param {string} id 
   * @param {HTMLDialogElement} elem 
   * @param {Function} onOpen 
   * @param {Function} onClose 
   * @returns {undefined}
   */
  static register(id, elem, onOpen, onClose) {
    ModalHandler.#modals[id] = { elem, onOpen, onClose };
    const closeBtn = ModalHandler.#modals[id].elem.querySelector("[data-set-close]");

    if (!closeBtn) return;
    closeBtn.onclick = () => { ModalHandler.close(id) };
  }

  /**
   * Open registered modal
   * 
   * @param {String} id 
   * @returns {undefined}
   */
  static open(id) {
    const modal = ModalHandler.#modals[id];
    if (!modal) return;

    if (modal.onOpen) {
      modal.onOpen();
    }

    modal.elem.showModal();
  }

  /**
   * Close registered modal
   * 
   * @param {String} id 
   * @returns {undefined}
   */
  static close(id) {
    const modal = ModalHandler.#modals[id];
    if (!modal) return;

    if (modal.onClose) {
      modal.onClose();
    }

    modal.elem.close();
  }

  /**
   * Un register modal
   * 
   * @param {String} id 
   * @returns {undefined}
   */
  static unregister(id) {
    const modal = ModalHandler.#modals[id];
    if (!modal) return;

    delete ModalHandler.#modals[id];
  }


  /**
   * get all registred modals.
   * 
   * @returns {undefined}
   */
  static getRegisteredModals() {
    return ModalHandler.#modals;
  }
}