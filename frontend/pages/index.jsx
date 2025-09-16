import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Home(){
  const [classes, setClasses] = useState([]);

  useEffect(()=>{ fetch(); }, []);
  async function fetch(){
    const { data } = await supabase.from('classes').select('*').eq('is_public', true).order('start_time', { ascending: true });
    setClasses(data || []);
  }

  return (
    <main style={{maxWidth:900, margin:'40px auto', fontFamily:'Arial'}}>
      <h1>Ibiza Gym — Planning public</h1>
      <p>Consultez les prochains cours publics.</p>
      <div>
        {classes.map(c => (
          <div key={c.id} style={{border:'1px solid #ddd', padding:12, margin:8, borderRadius:6}}>
            <h3>{c.title}</h3>
            <div>{new Date(c.start_time).toLocaleString()} - {new Date(c.end_time).toLocaleString()}</div>
            <div>Instructor: {c.instructor}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:20}}>
        <Link href="/admin/dashboard"><a>Admin — Dashboard</a></Link>
      </div>
    </main>
  );
}
