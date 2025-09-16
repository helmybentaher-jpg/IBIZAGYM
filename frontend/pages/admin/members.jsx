import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Members(){
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(()=>{ fetchProfiles(); }, []);

  async function fetchProfiles(){
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending:false });
    setProfiles(data || []);
  }

  async function addMember(e){
    e.preventDefault();
    await supabase.from('profiles').insert([{ full_name: name, email }]);
    setName(''); setEmail('');
    fetchProfiles();
  }

  async function deleteMember(id){
    if(!confirm('Supprimer ce membre ?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    fetchProfiles();
  }

  return (
    <main style={{maxWidth:900, margin:'30px auto', fontFamily:'Arial'}}>
      <h1>Gérer les membres</h1>
      <form onSubmit={addMember}>
        <input placeholder="Nom" value={name} onChange={e=>setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button>Ajouter</button>
      </form>

      <ul>
        {profiles.map(p => (
          <li key={p.id}>
            {p.full_name} — {p.email} {' '}
            <button onClick={()=>deleteMember(p.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
