import React, {useState, useEffect} from 'react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import dayjs from 'dayjs';

const sample = ()=>{
  const raw = localStorage.getItem('kmt_leave');
  if(raw) return JSON.parse(raw);
  const demo = [{ sl:1, name:'IYAPPAN ARUMUGAM', id:'90785788', area:'Rustaq', start:'2025-12-01', end:'2025-12-05', type:'Annual', isDeleted:false }];
  localStorage.setItem('kmt_leave', JSON.stringify(demo));
  return demo;
};

export default function Leave(){
  const [list,setList]=useState(sample);
  const [form,setForm]=useState({name:'', id:'', area:'', start:dayjs().format('YYYY-MM-DD'), end:dayjs().add(1,'day').format('YYYY-MM-DD'), type:'Emergency'});
  const [showDeleted,setShowDeleted]=useState(false);

  useEffect(()=> localStorage.setItem('kmt_leave', JSON.stringify(list)), [list]);

  function add(e){ e.preventDefault(); const next={...form, sl: list.length? Math.max(...list.map(l=>l.sl))+1:1, isDeleted:false}; setList([next,...list]); }
  function toggleDelete(sl){ setList(list.map(l=> l.sl===sl? {...l, isDeleted:!l.isDeleted} : l)); }
  function recoverAll(){ setList(list.map(l=> ({...l, isDeleted:false}))); }

  const visible = list.filter(l=> showDeleted? true : !l.isDeleted);
  const columns=['sl','name','id','area','start','end','type'];

  return (
    <div>
      <h3>Leave Requests</h3>
      <form onSubmit={add}>
        <div className='form-row'>
          <input className='input' placeholder='Name' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className='input' placeholder='ID' value={form.id} onChange={e=>setForm({...form, id:e.target.value})} />
          <input className='input' placeholder='Area' value={form.area} onChange={e=>setForm({...form, area:e.target.value})} />
        </div>
        <div className='form-row'>
          <input className='input' type='date' value={form.start} onChange={e=>setForm({...form, start:e.target.value})} />
          <input className='input' type='date' value={form.end} onChange={e=>setForm({...form, end:e.target.value})} />
          <select className='select' value={form.type} onChange={e=>setForm({...form, type:e.target.value})}><option>Emergency</option><option>Annual</option></select>
          <button className='button' type='submit'>Request Leave</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        <label><input type='checkbox' checked={showDeleted} onChange={e=>setShowDeleted(e.target.checked)} /> Show deleted</label>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToExcel(visible,'Leave','Leave_List')}>Export Excel</button>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToPDF(columns,visible,'Leave_List')}>Export PDF</button>
        <button className='button' style={{marginLeft:8}} onClick={recoverAll}>Recover All</button>
      </div>

      <table className='table'>
        <thead><tr><th>SL</th><th>Name</th><th>ID</th><th>Area</th><th>Start</th><th>End</th><th>Type</th><th>Actions</th></tr></thead>
        <tbody>
          {visible.map(l=> (<tr key={l.sl}><td>{l.sl}</td><td>{l.name}</td><td>{l.id}</td><td>{l.area}</td><td>{l.start}</td><td>{l.end}</td><td>{l.type}</td><td><button className='button' onClick={()=>toggleDelete(l.sl)}>{l.isDeleted?'Recover':'Delete'}</button></td></tr>))}
        </tbody>
      </table>
    </div>
  );
      }
    
