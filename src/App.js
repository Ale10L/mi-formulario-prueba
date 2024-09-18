import React, { useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const { data, error } = await supabase.from('contactos').insert([
      {
        nombre,
        email,
        mensaje,
      },
    ]);

    if (error) {
      console.error(error);
      alert('Hubo un error al enviar el formulario.');
    } else {
      setExito(true);
      setNombre('');
      setEmail('');
      setMensaje('');
    }

    setEnviando(false);
  };

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('contactos') // Cambia el nombre si usas otra tabla
      .select('*'); // Obtiene todos los datos de la tabla

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      return data;
    }
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(','); // Extrae las cabeceras
    const rows = data.map(row => Object.values(row).join(',')).join('\n'); // Convierte los datos en filas
    return `${headers}\n${rows}`;
  };

  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async () => {
    const data = await fetchData(); // Obtiene los datos de la base de datos
    if (data) {
      const csvData = convertToCSV(data); // Convierte los datos a CSV
      downloadCSV(csvData, 'respuestas_contactos.csv'); // Descarga el archivo
    }
  };

  return (
    <div>
      <h1>Formulario de Contacto</h1>
      {exito ? (
        <p>¡Gracias por contactarnos!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Mensaje:</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      )}

      <div>
        <button onClick={handleDownload}>Descargar respuestas</button>
      </div>
    </div>
  );
}

export default App;
