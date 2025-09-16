import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login(){
  const [email, setEmail] = useState('');

  async function signIn(){
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) return alert(error.message);
    alert('Lien magique envoyé à votre email.');
  }

  return (
    <main style={{maxWidth:600, margin:'40px auto', fontFamily:'Arial'}}>
      <h2>Connexion / Inscription</h2>
      <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} />
      <button onClick={signIn}>Envoyer lien</button>
    </main>
  );
}
