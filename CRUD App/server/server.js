const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "arkademy",
});

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// READ
app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * from produk";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

// READ BY NAME
app.get("/api/get/:nama", (req, res) => {
  const namaProduk = req.params.nama;
  const sqlSelectById = "SELECT * FROM produk WHERE nama_produk = ?";
  db.query(sqlSelectById, namaProduk, (err, result) => {
    res.send(result);
  });
});

//DELETE
app.delete("/api/delete/:nama", (req, res) => {
  const namaProduk = req.params.nama;
  const sqlDelete = "DELETE FROM produk WHERE nama_produk = ?";
  db.query(sqlDelete, namaProduk, (err, result) => {
    if (err) console.log(err);
  });
});

// CREATE
app.post("/api/create", (req, res) => {
  const sqlInsert = `INSERT INTO produk VALUES(?,?,?,?)`;
  const namaProduk = req.body.namaProduk;
  const keterangan = req.body.keterangan;
  const harga = req.body.harga;
  const jumlah = req.body.jumlah;
  db.query(
    sqlInsert,
    [namaProduk, keterangan, harga, jumlah],
    (err, result) => {
      console.log(result);
    }
  );
});

//UPDATE
app.put("/api/update", (req, res) => {
  const sqlUpdate = `UPDATE produk SET nama_produk = ?, keterangan = ?, harga = ?, jumlah = ? WHERE nama_produk = ? OR keterangan = ?`;
  const namaProduk = req.body.namaProduk;
  const keterangan = req.body.keterangan;
  const harga = req.body.harga;
  const jumlah = req.body.jumlah;
  db.query(
    sqlUpdate,
    [namaProduk, keterangan, harga, jumlah, namaProduk, keterangan],
    (err, result) => console.log(result)
  );
});

// app.get("/", (req, res) => {
//   const sqlInsert = `INSERT INTO produk VALUES("Pisang","Pisang molen",2000,10);`;
//   db.query(sqlInsert, (err, result) => {
//     res.send("Data created");
//   });
// });
