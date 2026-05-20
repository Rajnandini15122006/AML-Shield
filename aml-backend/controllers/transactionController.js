const Transaction =
  require("../models/Transaction");


// GET ALL TRANSACTIONS

const getTransactions =
  async (req, res) => {

    try {

      const transactions =
        await Transaction.find()

        .limit(100);

      res.json(
        transactions
      );

    } catch (error) {

      console.error(error);

      res.status(500).json({

        message:
          "Server Error"
      });

    }

};

module.exports = {
  getTransactions
};