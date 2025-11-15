import React, {useState, useEffect} from 'react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import dayjs from 'dayjs';

const samplePPE = ()=>{
  const raw = localStorage.getItem('kmt_ppe');
  if(raw) return JSON.parse(raw);
  const demo = [ { sl:1, date:'2025-11-10', name:'MARIAPPAN RAJA', id:'123458335', materials:'T-SHIRT', size:'XXL', qty:1, remark:'Issued', isDeleted:false }];
  localStorage.setItem('kmt_ppe', JSON.stringify(demo));
  return demo;
};

export default function PPE({user}){
  const [items,setItems]=useState(samplePPE);
  const [form,setForm]=useState({date:dayjs().format('YYYY-MM-DD'), name:user.name, id:'', materials:'T-SHIRT', size:'M', qty:1, remark:''});
  const [showDeleted,setShowDeleted]=useState(false);

  useEffect(()=> localStorage.setItem('kmt_ppe', JSON.stringify(items)), [items]);

  function add(e){ e.preventDefault(); const next={...form, sl: items.length? Math.max(...items.map(i=>i.sl))+1 : 1, isDeleted:false}; setItems([next,...items]); }
  function toggleDelete(sl){ setItems(items.map(i=> i.sl===sl? {...i, isDeleted: !i.isDeleted}: i)); }
  function recoverAll(){ setItems(items.map(i=> ({...i, isDeleted:false}))); }

  const visible = items.filter(i=> showDeleted? true : !i.isDeleted);

  const columns = ['sl','date','name','id','materials','size','qty','remark'];

  return (
    <div>
      <h3>PPE Management</h3>
      <form onSubmit={add}>
        <div className='form-row'>
          <input className='input' type='date' value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          <input className='input' placeholder='Name' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className='input' placeholder='ID No' value={form.id} onChange={e=>setForm({...form, id:e.target.value})} />
          <input className='input' placeholder='Materials' value={form.materials} onChange={e=>setForm({...form, materials:e.target.value})} />
          <input className='input small' placeholder='Size' value={form.size} onChange={e=>setForm({...form, size:e.target.value})} />
          <input className='input small' type='number' min='1' value={form.qty} onChange={e=>setForm({...form, qty: parseInt(e.target.value || '1')})} />
        </div>
        <div className='form-row'>
          <input className='input' placeholder='Remark' value={form.remark} onChange={e=>setForm({...form, remark:e.target.value})} />
          <button className='button' type='submit'>Add PPE Record</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        <label><input type='checkbox' checked={showDeleted} onChange={e=>setShowDeleted(e.target.checked)} /> Show deleted</label>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToExcel(visible,'PPE','PPE_List')}>Export Excel</button>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToPDF(columns,visible,'PPE_List')}>Export PDF</button>
        <button className='button' style={{marginLeft:8}} onClick={recoverAll}>Recover All</button>
      </div>

      <table className='table'>
        <thead><tr><th>SL</th><th>Date</th><th>Name</th><th>ID</th><th>Materials</th><th>Size</th><th>Qty</th><th>Remark</th><th>Actions</th></tr></thead>
        <tbody>
          {visible.map(i=> (
            <tr key={i.sl}><td>{i.sl}</td><td>{i.date}</td><td>{i.name}</td><td>{i.id}</td><td>{i.materials}</td><td>{i.size}</td><td>{i.qty}</td><td>{i.remark}</td><td><button className='button' onClick={()=>toggleDelete(i.sl)}>{i.isDeleted?'Recover':'Delete'}</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
    }
    
