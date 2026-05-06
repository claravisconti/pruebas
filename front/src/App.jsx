import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {

  //GET ALL
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [numberPerPage, setNumberPerPage] = useState(1)
  // Search
  const [name, setName] = useState("")

  useEffect(() => {
    fetch(`http://localhost:8000/products?page=${page}&numberPerPage=${numberPerPage}&name=${name}`)
      .then((res) => res.json())
      .then((json) => {
        setProducts(json.data);
        setTotal(json.total);
      })
      .catch((err) => {
      });
  }, [page, numberPerPage, name]); // importante: array vacío = se ejecuta una vez

  //1) Funcion que aumente el numero de paginas +1
  const next = () => {
    const totalPages = Math.ceil(total / (page + 1));
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  //2) Funcion que vaya a la anterior
  const prev = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  //POST

  const [form, setForm] = useState({})
  const [isVisibleNewProduct, setIsVisibleNewProduct] = useState(false)

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
      setIsVisibleNewProduct(false);

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
    <div className="min-h-screen bg-slate-100 p-6">
      {/* GET */}
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      {/* SEARCH */}
      <div className='flex justify-between my-4'>
        <input
          type='text'
          value={name}
          onChange={(e) => { setName(e.target.value); setPage(0) }}
          className='bg-white text-black border-2 p-1'
        />

        <div
          onClick={() => setIsVisibleNewProduct(true)}
          className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 h-8"
        >
          Nuevo
        </div>
      </div>

      <div className="grid gap-4 mb-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow p-4 border"
          >
            <ul className="space-y-1 mb-3">
              <li><span className="font-semibold">Nombre:</span> {product.name}</li>
              <li><span className="font-semibold">Descripción:</span> {product.description}</li>
              <li><span className="font-semibold">Precio:</span> ${product.price}</li>
              <li><span className="font-semibold">Stock:</span> {product.stock}</li>
            </ul>

            <div className="flex gap-2">
              <button
                onClick={() => editProduct(product)}
                className="px-3 py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                onClick={() => deleteProduct(product.id)}
                className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>



      {/* Pagination */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => prev()}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>

        {
          Array.from({ length: Math.ceil(total / numberPerPage) }, (_, i) => i + 1).map((i) => {
            return (
              <div onClick={() => setPage(i - 1)} className={`cursor-pointer text-md ${page == i - 1 ? 'font-bold' : ''}`}>
                {i}
              </div>
            )
          })
        }

        <button
          onClick={() => next()}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>

        <div className="mb-4 flex items-center gap-2">
          <label className="font-medium">Por página:</label>

          <select
            value={numberPerPage}
            onChange={(e) => {
              setNumberPerPage(Number(e.target.value));
              setPage(0); // opcional: vuelve a la primera página
            }}
            className="border rounded px-2 py-1"
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>
        </div>
      </div>

      {/* POST */}
      {isVisibleNewProduct && (
        <div className="bg-white p-4 rounded-xl shadow mb-6 max-w-md">
          <h3 className="text-xl font-semibold mb-4">Nuevo</h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Precio</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
            >
              Guardar
            </button>
          </form>
        </div>
      )
      }

      {/* PUT */}
      {isVisible && (
        <div className="bg-white p-4 rounded-xl shadow max-w-md">
          <h3 className="text-xl font-semibold mb-4">Modificar</h3>

          <form onSubmit={handleSubmit2} className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                name="name"
                value={form2.name}
                onChange={handleChange2}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Descripción</label>
              <textarea
                name="description"
                value={form2.description}
                onChange={handleChange2}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Precio</label>
              <input
                type="number"
                name="price"
                value={form2.price}
                onChange={handleChange2}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default App
