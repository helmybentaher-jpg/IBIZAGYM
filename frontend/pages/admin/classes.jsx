import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Classes(){
  const [classes, setClasses] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(()=>{ fetchClasses(); }, []);

  async function fetchClasses(){
    const { data } = await supabase.from('classes').select('*').order('start_time',{ascending:true});
    setClasses(data || []);
  }

  async function addClass(e){
    e.preventDefault();
    await supabase.from('classes').insert([{ title, start_time: start, end_time: end }]);
    setTitle(''); setStart(''); setEnd('');
    fetchClasses();
  }

  async function deleteClass(id){
    if(!confirm('Supprimer ce cours ?')) return;
    await supabase.from('classes').delete().eq('id', id);
    fetchClasses();
  }

  return (
    <main style={{maxWidth:900, margin:'30px auto', fontFamily:'Arial'}}>
      <h1>Gérer les cours</h1>
      <form onSubmit={addClass}>
        <input placeholder="Titre" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input placeholder="Start (ISO)" value={start} onChange={e=>setStart(e.target.value)} required />
        <input placeholder="End (ISO)" value={end} onChange={e=>setEnd(e.target.value)} required />
        <button>Ajouter le cours</button>
      </form>

      <ul>
        {classes.map(c => (
          <li key={c.id}>
            {c.title} — {new Date(c.start_time).toLocaleString()} {' '}
            <button onClick={()=>deleteClass(c.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
