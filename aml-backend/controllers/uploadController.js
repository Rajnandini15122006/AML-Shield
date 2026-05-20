const fs = require("fs");

const csv = require("csv-parser");

const xlsx = require("xlsx");

const Transaction =
  require("../models/Transaction");

const uploadFile =
  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400)
          .json({
            message:
              "No file uploaded"
          });

      }

      const filePath =
        req.file.path;

      const fileName =
        req.file.originalname;

      let results = [];

      // =========================
      // CSV SUPPORT
      // =========================

      if (fileName.endsWith(".csv")) {

        fs.createReadStream(filePath)

          .pipe(csv())

          .on("data", (data) => {

            results.push({

              transactionId:
                data.transactionId,

              amount:
                data.amount,

              risk:
                data.risk,

              score:
                data.score,

              status:
                data.status,

              sender:
                data.sender,

              receiver:
                data.receiver,

              anomalyScore:
                Math.random()

            });

          })

          .on("end", async () => {

            await Transaction.deleteMany({});

            await Transaction.insertMany(
              results
            );

            res.json({

              message:
                "CSV uploaded successfully",

              totalTransactions:
                results.length

            });

          });

      }

      // =========================
      // EXCEL SUPPORT
      // =========================

      else if (

        fileName.endsWith(".xlsx") ||

        fileName.endsWith(".xls")

      ) {

        const workbook =
          xlsx.readFile(filePath);

        const sheetName =
          workbook.SheetNames[0];

        const worksheet =
          workbook.Sheets[sheetName];

        const data =
          xlsx.utils.sheet_to_json(
            worksheet
          );

        results = data.map((item) => ({

          transactionId:
            item.transactionId,

          amount:
            item.amount,

          risk:
            item.risk,

          score:
            item.score,

          status:
            item.status,

          sender:
            item.sender,

          receiver:
            item.receiver,

          anomalyScore:
            Math.random()

        }));

        await Transaction.deleteMany({});

        await Transaction.insertMany(
          results
        );

        res.json({

          message:
            "Excel uploaded successfully",

          totalTransactions:
            results.length

        });

      }

      // =========================
      // INVALID FILE
      // =========================

      else {

        return res.status(400)
          .json({

            message:
              "Only CSV and Excel files allowed"

          });

      }

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error"

      });

    }

};

module.exports = {
  uploadFile
};