const { getDb } = require("../config/firebase");

async function createTransaction(req, res, next) {
  try {
    const db = getDb();

    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({
        message: "userId and bookId are required"
      });
    }

    const transactionId = db.collection("transactions").doc().id;

    const transaction = {
      transactionId,
      userId,
      bookId,
      status: "borrowed",
      createdAt: new Date()
    };

    await db
      .collection("transactions")
      .doc(transactionId)
      .set(transaction);

    res.status(201).json({
      message: "Transaction created successfully",
      transaction
    });
  } catch (error) {
    next(error);
  }
}

async function getAllTransactions(req, res, next) {
  try {
    const db = getDb();

    const snapshot = await db.collection("transactions").get();

    const transactions = snapshot.docs.map(doc => doc.data());

    res.json({
      count: transactions.length,
      transactions
    });
  } catch (error) {
    next(error);
  }
}

async function getMyTransactions(req, res, next) {
  try {
    const db = getDb();

    const snapshot = await db
      .collection("transactions")
      .where("userId", "==", req.user.userId)
      .get();

    const transactions = snapshot.docs.map(doc => doc.data());

    res.json({
      count: transactions.length,
      transactions
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createTransaction,
  getAllTransactions,
  getMyTransactions
};