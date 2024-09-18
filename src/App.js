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
    </div>
  );
}

export default App;
