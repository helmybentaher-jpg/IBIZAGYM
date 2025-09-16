import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Dashboard(){
  const [classes, setClasses] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(()=>{ fetchData(); }, []);
  async function fetchData(){
    const { data: c } = await supabase.from('classes').select('*').order('start_time', { ascending: true });
    const { data: p } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setClasses(c || []); setProfiles(p || []);
  }

  return (
    <main style={{maxWidth:1000, margin:'30px auto', fontFamily:'Arial'}}>
      <h1>Admin Dashboard</h1>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1}}>
          <h2>Prochains cours</h2>
          <Link href="/admin/classes"><a>Gérer les cours</a></Link>
          <ul>
            {classes.map(c => <li key={c.id}>{c.title} — {new Date(c.start_time).toLocaleString()}</li>)}
          </ul>
        </div>
        <div style={{flex:1}}>
          <h2>Membres</h2>
          <Link href="/admin/members"><a>Gérer les membres</a></Link>
          <ul>
            {profiles.map(p => <li key={p.id}>{p.full_name} — {p.email}</li>)}
          </ul>
        </div>
      </div>
    </main>
  );
}
