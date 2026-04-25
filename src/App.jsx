import { useState } from "react";
import "./App.css";

function App() {
  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    valorBase: "",
    iva: "",
    descuento: "",
  });

  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const calcular = async (e) => {
    e.preventDefault();
    setError("");
    setResultado(null);

    const datos = {
      codigo: formulario.codigo,
      nombre: formulario.nombre,
      valorBase: Number(formulario.valorBase),
      iva: Number(formulario.iva),
      descuento: Number(formulario.descuento),
    };

    try {
      const respuesta = await fetch("https://back-iva-descuento.onrender.com/calcularValorFinal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.titulo || "Error al calcular");
        return;
      }

      setResultado(data);
    } catch (error) {
      setError("No se pudo conectar con el backend");
    }
  };

  return (
    <div className="contenedor">
      <h1>Formulario</h1>

      <form onSubmit={calcular} className="formulario">
        <label>Código</label>
        <input
          type="text"
          name="codigo"
          placeholder="Alfanumérico"
          value={formulario.codigo}
          onChange={manejarCambio}
        />

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          placeholder="Solo letras"
          value={formulario.nombre}
          onChange={manejarCambio}
        />

        <label>Costo Base</label>
        <input
          type="number"
          name="valorBase"
          placeholder="Numérico"
          value={formulario.valorBase}
          onChange={manejarCambio}
        />

        <label>IVA %</label>
        <input
          type="number"
          name="iva"
          placeholder="Numérico"
          value={formulario.iva}
          onChange={manejarCambio}
        />

        <label>Descuento %</label>
        <input
          type="number"
          name="descuento"
          placeholder="Numérico"
          value={formulario.descuento}
          onChange={manejarCambio}
        />

        <button type="submit">Calcular</button>
      </form>

      {error && (
        <div className="error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {resultado && (
        <div className="resultado">
          <h2>{resultado.titulo}</h2>
          <p><strong>Código HTTP:</strong> {resultado.codigoHTTP}</p>
          <p><strong>Valor base:</strong> {resultado.valorBase}</p>
          <p><strong>IVA:</strong> {resultado.iva}%</p>
          <p><strong>Descuento:</strong> {resultado.descuento}%</p>
          <p><strong>Valor final:</strong> ${resultado.valor}</p>
        </div>
      )}
    </div>
  );
}

export default App;