const { nanoid } = require('nanoid');
const books = require('./books');

// Add Book Handler Function
const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // IF user not insert property Name
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    // IF user Insert read page more than page Book
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    const id = nanoid(16);
    // set finished and unfinished reading
    const finished = pageCount === readPage;

    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    // Default
    if (!name && !reading && !finished) {
        const dataBooks = books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        }));

        const response = h.response({
            status: 'success',
            data: {
                books: dataBooks,
            },
        });
        response.code(200);
        return response;
    }
    if (name) {
        const dataBooksByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));

        const response = h.response({
            status: 'success',
            data: {
                books: dataBooksByName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    if (reading) {
        const dataBooksReading = books.filter(
            (book) => Number(book.reading) === Number(reading),
        );
        const response = h.response({
            status: 'success',
            data: {
                books: dataBooksReading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    const dataBooksFinished = books.filter(
        (book) => Number(book.finished) === Number(finished),
    );
    const response = h.response({
        status: 'success',
        data: {
            books: dataBooksFinished.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};

const getBooksHandler = (request, h) => {
    const { bookId } = request.params;
    const dataBook = books.filter((book) => book.id === bookId)[0];

    if (dataBook) {
        const response = h.response({
            status: 'success',
            data: {
                book: dataBook,
            },
        });
        response.code(200);
        return response;
    }

    // Not Found Id Book
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const updateBooksHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();

    // IF no input name
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    // IF user Insert read page more than page Book
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }
    // Execute update
    const finished = pageCount === readPage;
    const index = books.findIndex((note) => note.id === bookId);
    // Find book id and update data
    if (index !== -1) {
        books[index] = {
            ...books[index],
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

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    // Id not found
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const destroyBooksHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((note) => note.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);

        // Bila id dimiliki oleh salah satu buku
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler, getAllBooksHandler, getBooksHandler, updateBooksHandler, destroyBooksHandler,
};
