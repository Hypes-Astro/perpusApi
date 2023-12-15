const {
  tambahItem,
  getAllitem,
  getIdBooks,
  editItem,
  deleteItem,
} = require('./handler');

const routes = [
  {
    method: 'POST', //untk mengirim data
    path: '/books',
    handler: tambahItem,
  },
  {
    method: 'GET', // untuk mendapatkan data keseluruhan 
    path: '/books',
    handler: getAllitem,
  },
  {
    method: 'GET', // mengambil data sesuai dengan id
    path: '/books/{bookId}',
    handler: getIdBooks,
  },
  {
    method: 'PUT', //memperbarui data
    path: '/books/{bookId}',
    handler: editItem,
  },
  {
    method: 'DELETE', //menghapus data
    path: '/books/{bookId}',
    handler: deleteItem,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: () => 'Halaman tidak ditemukan',
  },
];

module.exports = routes;
