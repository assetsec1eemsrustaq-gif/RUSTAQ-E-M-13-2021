import React, {useState, useEffect} from 'react';
import SimpleTable from './SimpleTable';
import { exportToExcel } from '../utils/excelExport';
import { exportToPDF } from '../utils/pdfExport';
import { loadData, saveData } from '../utils/storage';

export default function PPE({currentUser}){
  const [db, setDb] = useState(loadData());
  const [form, setForm] = useState({DATE:'', NATIONALITY:'INDIAN', NAME:'', ID:'', PPE_NAME:'T-SHIRT', SIZE:'', QTY:1, DESIGNATION:''});
  useEffect(()=>{ saveData(db); },[db]);

  const add = (e) => {
    e.preventDefault();
    const next = { id: Date.now(), SL: db.ppe.length + 1, ...form, STATUS:'SEND', photos:[], deleted:false };
    setDb({...db, ppe: [...db.ppe, next]});
    setForm({DATE:'', NATIONALITY:'INDIAN', NAME:'', ID:'', PPE_NAME:'T-SHIRT', SIZE:'', QTY:1, DESIGNATION:''});
  };

  const columns = ['SL','DATE','NATIONALITY','NAME','ID','PPE_NAME','SIZE','QTY','DESIGNATION','STATUS','PHOTOS'];

  const filtered = db.ppe.filter(p=>!p.deleted);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">PPE Request & Received</h3>
      <form onSubmit={add} className="grid grid-cols-2 gap-2 mb-4 p-2 border rounded">
        <input placeholder="Date" value={form.DATE} onChange={e=>setForm({...form, DATE:e.target.value})} className="p-2 border" />
        <select value={form.NATIONALITY} onChange={e=>setForm({...form, NATIONALITY:e.target.value})} className="p-2 border">
          <option value="INDIAN">INDIAN</option>
          <option value="OMANI">OMANI</option>
          <option value="PAKISTANI">PAKISTANI</option>
          <option value="BANGLADESH">BANGLADESH</option>
        </select>
        <input placeholder="Name" value={form.NAME} onChange={e=>setForm({...form, NAME:e.target.value})} className="p-2 border" />
        <input placeholder="ID No" value={form.ID} onChange={e=>setForm({...form, ID:e.target.value})} className="p-2 border" />
        <select value={form.PPE_NAME} onChange={e=>setForm({...form, PPE_NAME:e.target.value})} className="p-2 border">
          <option>T-SHIRT</option><option>SHIRT</option><option>PANTS</option><option>HELMET</option><option>SHOE</option><option>COVERALL</option>
        </select>
        <input placeholder="Size" value={form.SIZE} onChange={e=>setForm({...form, SIZE:e.target.value})} className="p-2 border" />
        <input type="number" placeholder="Qty" value={form.QTY} onChange={e=>setForm({...form, QTY:parseInt(e.target.value||1)})} className="p-2 border" />
        <input placeholder="Designation" value={form.DESIGNATION} onChange={e=>setForm({...form, DESIGNATION:e.target.value})} className="p-2 border" />

        <div className="col-span-2">
          <button className="btn bg-green-500 text-white" type="submit">Send PPE Request</button>
        </div>
      </form>

      <div className="flex gap-2 mb-2">
        <button className="btn bg-blue-500 text-white" onClick={()=>exportToExcel(db.ppe, 'PPE', 'PPE_List')}>Export Excel</button>
        <button className="btn bg-indigo-500 text-white" onClick={()=>exportToPDF(['SL','DATE','NATIONALITY','NAME','ID','PPE_NAME','SIZE','QTY','DESIGNATION','STATUS'], db.ppe, 'PPE_List')}>Export PDF</button>
      </div>

      <SimpleTable columns={columns} data={filtered} />
    </div>
  );
}
