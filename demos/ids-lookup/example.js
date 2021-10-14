// Example for populating the DataGrid
const lookup = document.querySelector('#lookup-1');
const container = document.querySelector('ids-container');

(async function init() {
  // Set a Locale and wait for it to load
  await container.setLocale('en-US');

  // Do an ajax request
  const xmlhttp = new XMLHttpRequest();
  const url = '/data/books.json';
  const columns = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    sortable: false,
    resizable: false,
    formatter: lookup.dataGrid.formatters.text,
    align: 'center',
    width: 20
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: lookup.dataGrid.formatters.rowNumber,
    sortable: false,
    readonly: true,
    width: 65
  });
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    formatter: lookup.dataGrid.formatters.text
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    formatter: lookup.dataGrid.formatters.text
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    formatter: lookup.dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    formatter: lookup.dataGrid.formatters.text
  });

  xmlhttp.onreadystatechange = function onreadystatechange() {
    if (this.readyState === 4 && this.status === 200) {
      lookup.dataGridSettings = {
        rowHeight: 'small'
      };
      lookup.columns = columns;
      lookup.data = JSON.parse(this.responseText);
    }
  };

  // Execute the request
  xmlhttp.open('GET', url, true);
  xmlhttp.send();
}());
