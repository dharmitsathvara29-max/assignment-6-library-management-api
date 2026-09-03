const express = require("express");

const { body } = require("express-validator");

const {
  getBooks,
  getBook,
  searchBooks,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
} = require("../controllers/bookController");

const { authenticate } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const { validate } = require("../middleware/validator");

const router = express.Router();

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for title, author, ISBN, or category
 *         example: Harry
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchBooks);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of all books
 */
router.get("/", getBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get("/:id", getBook);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - category
 *               - quantity
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Alchemist
 *               author:
 *                 type: string
 *                 example: Paulo Coelho
 *               isbn:
 *                 type: string
 *                 example: 9780061122415
 *               category:
 *                 type: string
 *                 example: Fiction
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 5
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 */
router.post(
  "/",
  authenticate,
  authorize("librarian"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),

    body("author").trim().notEmpty().withMessage("Author is required"),

    body("isbn").trim().notEmpty().withMessage("ISBN is required"),

    body("category").trim().notEmpty().withMessage("Category is required"),

    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer")
  ],
  validate,
  createBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: The Alchemist
 *               author:
 *                 type: string
 *                 example: Paulo Coelho
 *               isbn:
 *                 type: string
 *                 example: 9780061122415
 *               category:
 *                 type: string
 *                 example: Fiction
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 */
router.put(
  "/:id",
  authenticate,
  authorize("librarian"),
  [
    body("title").optional().trim().notEmpty(),

    body("author").optional().trim().notEmpty(),

    body("isbn").optional().trim().notEmpty(),

    body("category").optional().trim().notEmpty(),

    body("quantity").optional().isInt({ min: 0 })
  ],
  validate,
  updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Librarian access required
 */
router.delete(
  "/:id",
  authenticate,
  authorize("librarian"),
  deleteBook
);

/**
 * @swagger
 * /api/books/{id}/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: Book is unavailable
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Student access required
 *       404:
 *         description: Book not found
 */
router.post(
  "/:id/borrow",
  authenticate,
  authorize("student"),
  borrowBook
);

/**
 * @swagger
 * /api/books/{id}/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book return failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Student access required
 *       404:
 *         description: Book not found
 */
router.post(
  "/:id/return",
  authenticate,
  authorize("student"),
  returnBook
);

module.exports = router;