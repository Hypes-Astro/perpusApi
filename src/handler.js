const { nanoid } = require('nanoid'); // berfungsi untuk memberikan nilai unik berguna untuk id
const items = require('./items');

/*
 kriteria utama yang harus Anda penuhi dalam membuat proyek Bookshelf API.
  - Aplikasi menggunakan port 9000  -> di server sudah setting dlam 9000
  - Aplikasi dijalankan dengan perintah npm run start.
  - aplikasi tidak dijalankan dengan menggunakan nodemon. --> dalam package.json saya menggunakan node-dev
  - API dapat CRUD. dalam route mengambil metod handler disini

*/

const tambahItem = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // ketika name tidak dalam kondisi true / nama buku tidak ada

  if (!name) {
    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      }).code(400);
    return response;
  }
  // jumlah readpaget tidak boleh lebih dari jumlah lembar buku
  if (readPage > pageCount) {
    const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    return response;
  }

  const id = nanoid(16);//jumlah nilai unik untuk id sejumlah 16

  const finished = pageCount === readPage;
  
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

// sessuai struktur pada kriteria
  const newItem = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  items.push(newItem);

  const isSuccess = items.filter((book) => book.id === id).length > 0;

  if (isSuccess===false) {
      const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      }).code(500);
      return response;
  }

  else{
    const response = h
    .response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    .code(201);
  return response;
  }
};

const getAllitem = (request, h) => {
  const { name, reading, finished } = request.query;

  if (name) {
    const filteredBooksName = items.filter((book) => {
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // Get reading
  if (reading) {
    const filteredBooksReading = items.filter(
      (book) => Number(book.reading) === Number(reading),
    );

    const response = h
      .response({
        status: 'success',
        data: {
          book: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // Get finished
  if (finished) {
    const filteredBooksFinished = items.filter(
      (book) => Number(book.finished) === Number(finished),
    );

    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksFinished.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // mengembalikan nilai get semua buku
  const response = h
    .response({
      status: 'success',
      data: {
        books: items.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })),
      },
    })
    .code(200);

  return response;
};

const getIdBooks = (request, h) => {
  const { bookId } = request.params;
  const book = items.filter((note) => note.id === bookId)[0];

  // kondisi ketika id yang dicari ketemu
  if (book) {
    const response = h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
    return response;
  }

  // kondisi ketika id yang dicari tidak ketemu
  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

const editItem = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  //nilai finished adaalh nilai ketika kondisi dari pagecount sama seperti readpage yg telah dibaca.
  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const index = items.findIndex((book) => book.id === bookId); // findIndex merupakan (built in dalam js)
  //memeriksa apakah buku dengan bookId tersebut ditemukan atau tidak dalam array items
  if (index >= 0) {//ika tidak ada elemen yang memenuhi kondisi, metode ini mengembalikan nilai -1.
    items[index] = {
      ...items[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  // Jika book dengan id yang dicari tidak ditemukan
  const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  return response;
};

const deleteItem = (request, h) => {
  const { bookId } = request.params;

  const index = items.findIndex((book) => book.id === bookId);

  // Jika book dengan id yang dicari ditemukan
  if (index !== -1) {
    items.splice(index, 1);

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  }

  // Jika book dengan id yang ingin di hpaus tidak ditemukan
  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = {
  tambahItem,
  getAllitem,
  getIdBooks,
  editItem,
  deleteItem,
};