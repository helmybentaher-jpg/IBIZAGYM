import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Button } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

export default function App() {
  const [classes, setClasses] = useState([]);

  useEffect(()=>{ fetchClasses(); }, []);

  async function fetchClasses(){
    const { data } = await supabase.from('classes').select('*').order('start_time',{ascending:true});
    setClasses(data || []);
  }

  return (
    <View style={{padding:20}}>
      <Text style={{fontSize:20, marginBottom:12}}>Ibiza Gym — Mobile</Text>
      <FlatList data={classes} keyExtractor={i=>i.id} renderItem={({item}) => (
        <View style={{padding:8, borderBottomWidth:1, borderColor:'#eee'}}>
          <Text style={{fontWeight:'600'}}>{item.title}</Text>
          <Text>{new Date(item.start_time).toLocaleString()}</Text>
        </View>
      )} />
    </View>
  );
}
