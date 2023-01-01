const { nanoid } = require('nanoid');
const books = require('./books');

const insertToBooks = (newBook) => {
    books.push(newBook);
};

const addBookHandler = (request, h) => {
    try {
        let newResponse = {};

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
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;
        const finished = pageCount === readPage;

        if (!name) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            });
            response.code(400);
            newResponse = response;
            return newResponse;
        }

        if (readPage > pageCount) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            newResponse = response;
            return newResponse;
        }

        insertToBooks({
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
        });

        const isSuccess = books.filter((book) => book.id === id).length > 0;
        if (isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                },
            });
            response.code(201);
            newResponse = response;
        }
        return newResponse;
    } catch {
        const response = h.response({
            status: 'server error',
            message: 'Server sedang bermasalah',
        });
        response.code(500);
        return response;
    }
};

const getAllBooksHandler = (request, h) => {
    try {
        const { name, reading, finished } = request.query;
        let filteredBooks = books;

        if (name) {
            filteredBooks = filteredBooks
                .filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        }

        if (reading) {
            console.log('masuk 2');
            filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
        }

        if (finished) {
            console.log('masuk 3');
            filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));
        }

        const response = h.response({
            status: 'success',
            data: {
                books: filteredBooks.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });

        console.log('masuk 5');
        response.code(200);
        return response;
    } catch {
        const response = h.response({
            status: 'server error',
            message: 'Buku gagal ditambahkan',
        });
        response.code(500);
        return response;
    }
};

const getBookByIdHandler = (request, h) => {
    try {
        const { bookId } = request.params;
        const book = books.filter((b) => b.id === bookId)[0];

        if (book !== undefined) {
            const response = h.response({
                status: 'success',
                data: {
                    book,
                },
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    } catch {
        const response = h.response({
            status: 'server error',
            message: 'Server sedang bermasalah',
        });
        response.code(500);
        return response;
    }
};

const updateBookByIdHandler = (request, h) => {
    try {
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
        const updatedAt = new Date().toISOString();
        const index = books.findIndex((book) => book.id === bookId);

        if (index !== -1) {
            if (!name) {
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Mohon isi nama buku',
                });
                response.code(400);
                return response;
            }

            if (readPage > pageCount) {
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                });
                response.code(400);
                return response;
            }

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
                updatedAt,
            };

            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    } catch {
        const response = h.response({
            status: 'server error',
            message: 'Server sedang bermasalah',
        });
        response.code(500);
        return response;
    }
};

const deleteBookByIdHandler = (request, h) => {
    try {
        const { bookId } = request.params;
        const index = books.findIndex((book) => book.id === bookId);

        if (index !== -1) {
            books.splice(index, 1);
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
    } catch {
        const response = h.response({
            status: 'server error',
            message: 'Server sedang bermasalah',
        });
        response.code(500);
        return response;
    }
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler,
};
