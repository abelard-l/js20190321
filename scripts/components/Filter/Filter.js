export class Filter {
  constructor({ element, callback }) {
      this._el = element;

      this._el.addEventListener("input", e => {
        callback(e.target.value);
      })    

      this._render();
  }

  _render() {
      this._el.innerHTML = `
          <div class="input-field col s6">
            <input placeholder="Enter money's name to search" data-input="filter" type="text" class="validate">  
          </div>
      `;
  }
}
