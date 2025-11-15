import React, {useState, useEffect} from 'react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import dayjs from 'dayjs';

const sample = ()=>{
  const raw = localStorage.getItem('kmt_cancel');
  if(raw) return JSON.parse(raw);
  const demo = [{ sl:1, name:'ARAVIND MUTHAIYAN', id:'117123432', area:'Rustaq', date:'2025-10-01', isDeleted:false }];
  localStorage.setItem('kmt_cancel', JSON.stringify(demo));
  return demo;
};

export default function Cancel(){
  const [list,setList]=useState(sample);
  const [form,setForm]=useState({name:'', id:'', area:'', date:dayjs().format('YYYY-MM-DD')});
  const [showDeleted,setShowDeleted]=useState(false);

  useEffect(()=> localStorage.setItem('kmt_cancel', JSON.stringify(list)), [list]);

  function add(e){ e.preventDefault(); const next={...form, sl: list.length? Math.max(...list.map(l=>l.sl))+1:1, isDeleted:false}; setList([next,...list]); }
  function toggleDelete(sl){ setList(list.map(l=> l.sl===sl? {...l, isDeleted:!l.isDeleted} : l)); }
  function recoverAll(){ setList(list.map(l=> ({...l, isDeleted:false}))); }

  const visible = list.filter(l=> showDeleted? true : !l.isDeleted);
  const columns=['sl','name','id','area','date'];

  return (
    <div>
      <h3>Cancel Requests</h3>
      <form onSubmit={add}>
        <div className='form-row'>
          <input className='input' placeholder='Name' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className='input' placeholder='ID' value={form.id} onChange={e=>setForm({...form, id:e.target.value})} />
          <input className='input' placeholder='Area' value={form.area} onChange={e=>setForm({...form, area:e.target.value})} />
          <input className='input' type='date' value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          <button className='button' type='submit'>Add Cancel</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        <label><input type='checkbox' checked={showDeleted} onChange={e=>setShowDeleted(e.target.checked)} /> Show deleted</label>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToExcel(visible,'Cancel','Cancel_List')}>Export Excel</button>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToPDF(columns,visible,'Cancel_List')}>Export PDF</button>
        <button className='button' style={{marginLeft:8}} onClick={recoverAll}>Recover All</button>
      </div>

      <table className='table'>
        <thead><tr><th>SL</th><th>Name</th><th>ID</th><th>Area</th><th>Cancel Date</th><th>Actions</th></tr></thead>
        <tbody>
          {visible.map(l=> (<tr key={l.sl}><td>{l.sl}</td><td>{l.name}</td><td>{l.id}</td><td>{l.area}</td><td>{l.date}</td><td><button className='button' onClick={()=>toggleDelete(l.sl)}>{l.isDeleted?'Recover':'Delete'}</button></td></tr>))}
        </tbody>
      </table>
    </div>
  );
            }
        
