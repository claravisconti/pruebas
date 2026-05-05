import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  //GET ALL
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((json) => {
        setProducts(json);
      })
      .catch((err) => {
      });
  }, []); // importante: array vacío = se ejecuta una vez

  //POST

  const [form, setForm] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const data = await res.json();
      console.log("Producto creado:", data);

      // opcional: limpiar formulario
      setForm({
        name: "",
        description: "",
        price: "",
      });

    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error en la petición");
      }
      console.log("Producto borrado:", id);

    } catch (error) {
      console.error(error);
    }
  };

  const [idModificar, setIdModificar] = useState()
  const [isVisible, setIsVisible] = useState(false)
  const [form2, setForm2] = useState({})

  const editProduct = async (product) => {
    setIdModificar(product.id)
    setIsVisible(true)
    setForm2(product)
  }

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setForm2({
      ...form2,
      [name]: value,
    });
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/products/${idModificar}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form2),
      });

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const data = await res.json();
      console.log("Producto modificado:", data);
      setIsVisible(false)

      // opcional: limpiar formulario
      setForm2({
        name: "",
        description: "",
        price: "",
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* GET */}
      <h1>Productos</h1>
      {products.map((product) => (
        <ul>
          <li>Nombre:{product.name}</li>
          <li>Descripción:{product.description}</li>
          <li>Precio:{product.price}</li>
          <li>Stock:{product.stock}</li>
          {/* DELETE */}
          <button onClick={() => editProduct(product)}>Editar</button>
          <button onClick={() => deleteProduct(product.id)}>Borrar</button>
        </ul>
      ))}

      {/* POST */}
      <h3>Nuevo</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Precio</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Guardar</button>
      </form>

      {/* PUT */}
      {isVisible && (<><h3>Modificar</h3>
        <form onSubmit={handleSubmit2} style={{ maxWidth: 400 }}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={form2.name}
              onChange={handleChange2}
            />
          </div>

          <div>
            <label>Descripción</label>
            <textarea
              name="description"
              value={form2.description}
              onChange={handleChange2}
            />
          </div>

          <div>
            <label>Precio</label>
            <input
              type="number"
              name="price"
              value={form2.price}
              onChange={handleChange2}
            />
          </div>

          <button type="submit">Guardar</button>
        </form></>)}


    </>
  )
}

export default App
