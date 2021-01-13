import React, { Fragment, useEffect, useRef, useState } from "react";
import Input from "./components/Input";
import Axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [getNama, setNama] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [labelArray, setLabelArray] = useState([
    "Nama produk",
    "Keterangan",
    "Harga",
    "Jumlah",
  ]);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((res) => setData(res.data));
  }, []);

  const toogleEdit = () => {
    setIsEdit(!isEdit);
    !isEdit
      ? setLabelArray([])
      : setLabelArray(["Nama produk", "Keterangan", "Harga", "Jumlah"]);
  };

  const createProduct = () => {
    const nama_produk = document.querySelector(".nama-produk").value;
    const keterangan = document.querySelector(".keterangan").value;
    const harga = document.querySelector(".harga").value;
    const jumlah = document.querySelector(".jumlah").value;
    Axios.post("http://localhost:3001/api/create", {
      namaProduk: nama_produk,
      keterangan: keterangan,
      harga: harga,
      jumlah: jumlah,
    });

    setData([
      ...data,
      {
        nama_produk: nama_produk,
        keterangan: keterangan,
        harga: harga,
        jumlah: jumlah,
      },
    ]);
  };

  return (
    <>
      <div>
        <div className="create-product-container">
          <h2 style={{ marginBottom: ".5em" }}>
            {isEdit ? "Edit product!" : "Create product!"}
          </h2>
          {labelArray.map((label, index) => (
            <Fragment key={index}>
              <label style={{ marginTop: ".25em" }}>{label} : </label>
              <Input
                className={label.replace(" ", "-").toLowerCase()}
                type="text"
                placeholder={
                  isEdit
                    ? "Edit your product list!"
                    : `Masukan ${label.toLowerCase()} disini!`
                }
              />
            </Fragment>
          ))}

          {!isEdit && (
            <div style={{ marginTop: "1em" }}>
              <button onClick={createProduct} className="btn-save">
                Save
              </button>
            </div>
          )}
        </div>

        <div className="list-product-container">
          <h2>List product!</h2>
          {!isEdit ? (
            <>
              <NotesDataRow
                setData={setData}
                data={data}
                toogleEdit={toogleEdit}
                setNama={setNama}
              />
            </>
          ) : (
            <NotesDataRowEdit nama={getNama} toogleEdit={toogleEdit} />
          )}
        </div>
      </div>
    </>
  );
}

const NotesDataRow = (props) => {
  const deleteProduct = (nama, index) => {
    Axios.delete(`http://localhost:3001/api/delete/${nama}`);
    props.data.splice(index, 1);
    const newData = [...props.data];
    props.setData(newData);
  };

  return (
    <>
      {props.data.map((value, index) => (
        <div key={index} className="notes-data-container">
          <h4 className="notes-data-text"> {value.nama_produk} </h4>
          <div className="notes-data-utils">
            <button
              onClick={() => {
                props.toogleEdit();
                props.setNama(value.nama_produk);
              }}
              className="btn btn-edit"
            >
              Edit
            </button>
            <button
              onClick={() => deleteProduct(value.nama_produk, index)}
              className="btn btn-delete"
            >
              X
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

const NotesDataRowEdit = (props) => {
  const [data, setData] = useState({});
  const labelArray = ["Nama produk", "Keterangan", "Harga", "Jumlah"];
  const updateInput = useRef(null);

  useEffect(() => {
    Axios.get(`http://localhost:3001/api/get/${props.nama}`).then((res) =>
      setData(...res.data)
    );
  }, [props.nama]);

  useEffect(() => {
    updateInput.current.focus();
  });

  const updateProduct = () => {
    const nama_produk = document.querySelector(".update-input-nama-produk")
      .value;
    const keterangan = document.querySelector(".update-input-keterangan").value;
    const harga = document.querySelector(".update-input-harga").value;
    const jumlah = document.querySelector(".update-input-jumlah").value;
    Axios.put(`http://localhost:3001/api/update`, {
      namaProduk: nama_produk,
      keterangan: keterangan,
      harga: harga,
      jumlah: jumlah,
    });
    window.location.reload();
  };

  return (
    <>
      {labelArray.map((label, index) => (
        <div key={index} className="notes-update-container">
          <label style={{ marginLeft: "1.2em" }}>{label}</label>
          <input
            ref={updateInput}
            defaultValue={data[label.replace(" ", "_").toLowerCase()]}
            type="text"
            className={`notes-update-input update-input-${label
              .replace(" ", "-")
              .toLowerCase()}`}
          ></input>
        </div>
      ))}

      <div style={{ marginTop: "1em" }}>
        <button onClick={updateProduct} className="btn-save">
          Save
        </button>
        <button onClick={props.toogleEdit} className="btn-cancel">
          Cancel
        </button>
      </div>
    </>
  );
};

export default App;
