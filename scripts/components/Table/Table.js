import BaseComponent from '../BaseComponent/BaseComponent.js';

export class Table extends BaseComponent {
  constructor({ data, element }) {
    super();
    
    this._el = element;
    this._data = data;

     
    this._render(this._data);

    this._el.addEventListener('click', e => {
      this._onRowClick(e);
    });

    this._el.addEventListener('click', e => {
        const target = e.target;
        if (target.nodeName !== "TH") return;
        
        const dataset = target.dataset;
        const sortType = dataset.sort;

        this._data.sort((a, b) => {
            switch(dataset.type) {
                case "string":
                    if (sortType === "asc") {
                        return (a[dataset.header] < b[dataset.header]) ? -1 : 1;
                    } else {
                        return (a[dataset.header] < b[dataset.header]) ? 1 : -1;
                    }
                    
                break;
                case "number":
                    if (sortType === "asc") {
                        return a[dataset.header] - b[dataset.header];
                    } else {
                        return b[dataset.header] - a[dataset.header];
                    }
                    
                break;
                
            }
        });

        this._render(this._data);

        this._updateClasses(dataset.header);
    });
  }

  filter(search) {
      if (search.length > 0) {
          this._render(this._data.filter(value => {
              if (value.id.includes(search)) return true;
          }));    
      }
      else {
          this._render(this._data);
      }     
  }

  _updateClasses(headerToAdd) {
      
      const headers = this._el.querySelectorAll("thead th");
      for (const header of headers) {
          if (header.dataset.header === headerToAdd)  {
              header.classList.add("sort-header");
              if (header.dataset.sort === "asc") {
                  header.dataset.sort = "desc";
              } else {
                  header.dataset.sort = "asc";
              }
          }    
      }
  }


  _onRowClick(e) {
    const target = e.target.closest('tbody tr');
    if (!target) return;

    const id = target.dataset.id;
    if (id) {
      let rowClickEvent = new CustomEvent('rowClick', {
        detail: { id },
      });
      this._el.dispatchEvent(rowClickEvent);
    }
  }
    
     _render(data) {
        this._el.innerHTML = `
        <table class="data-table highlight"> 
          <thead>
            <tr>
                <th data-header="name" data-sort="asc" data-type="string">Name</th>
                <th data-header="symbol" data-sort="asc" data-type="string">Symbol</th>
                <th data-header="rank" data-sort="asc" data-type="number">Rank</th>
                <th data-header="price" data-sort="asc" data-type="number">Price</th>
            </tr>
          </thead>
          <tbody>
            ${
              data.map(coin => `
                <tr data-id="${coin.id}">
                    <td>${coin.name}</td>
                    <td>${coin.symbol}</td>
                    <td>${coin.rank}</td>
                    <td>${coin.price}</td>
                </tr>
              `).join('')
            }
          </tbody>
        </table>
        `;
    }
}
