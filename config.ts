const headers = ['date', 'payee', 'amount']

const sydbank = {
  headers,
  mapper: [0, 1, 2], 
  delimiter: ';',
  bom: false,
  escape: false,
}

const danskebank = {
  headers,
  mapper: [0, 1, 2],
  delimiter: ';',
  bom: false,
  escape: false,
}

export default sydbank