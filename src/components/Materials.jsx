import React, {useState, useEffect} from 'react';
import SimpleTable from './SimpleTable';
import { exportToExcel } from '../utils/excelExport';
import { exportToPDF } from '../utils/pdfExport';
import { loadData, saveData } from '../utils/storage';

export default function Materials({currentUser}) {
  const [db, setDb] = useState(loadData());
  const [form, setForm] = useState({DATE:'', NATIONALITY:'INDIAN', PERSON:'', NAME:'', ID:'', AREA:'Rustaq Emergency', MATERIALS:'', SIZE:'', QTY:1, DESIGNATION:'', REMARK:''});
  const [search, setSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(()=>{ saveData(db); },[db]);

  const add = (e) => {
    e.preventDefault();
    const next = { 
      id: Date.now(),
      SL: db.materials.length + db.trash.length + 1,
      DATE: form.DATE || new Date().toLocaleDateString(),
      NATIONALITY: form.NATIONALITY,
      PERSON: form.PERSON,
      NAME: form.NAME,
      ID: form.ID,
      AREA: form.AREA,
      MATERIALS: form.MATERIALS,
      SIZE: form.SIZE,
      QTY: form.QTY,
      DESIGNATION: form.DESIGNATION,
      REMARK: form.REMARK,
      STATUS: 'SEND',
      photos_new: [],
      photos_old: [],
      deleted: false
    };
    setDb({...db, materials: [...db.materials, next]});
    setForm({DATE:'', NATIONALITY:'INDIAN', PERSON:'', NAME:'', ID:'', AREA:'Rustaq Emergency', MATERIALS:'', SIZE:'', QTY:1, DESIGNATION:'', REMARK:''});
  };

  const personnelFor = (nat) => {
    return (db.personnel[nat] || []).map(p=>p.name);
  };

  const updateStatus = (idx, status) => {
    const materials = [...db.materials];
    materials[idx].STATUS = status;
    setDb({...db, materials});
  };

  const del = (idx) => {
    const materials = [...db.materials];
    const item = materials.splice(idx,1)[0];
    item.deleted = true;
    setDb({...db, materials, trash: [...db.trash, item]});
  };

  const recover = (tidx) => {
    const trash = [...db.trash];
    const item = trash.splice(tidx,1)[0];
    item.deleted = false;
    setDb({...db, trash, materials: [...db.materials, item]});
  };

  const filtered = db.materials.filter(m=>{
    if(!showDeleted && m.deleted) return false;
    if(search && !(m.NAME+' '+m.ID+' '+m.MATERIALS+' '+m.AREA).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns = ['SL','DATE','NATIONALITY','PERSON','NAME','ID','AREA','MATERIALS','SIZE','QTY','DESIGNATION','REMARK','STATUS','PHOTOS_OLD','PHOTOS_NEW'];

  const exportRows = (rows) => rows.map((r,i)=>({
    'SL.NO': i+1,
    Date: r.DATE,
    Nationality: r.NATIONALITY,
    Person: r.PERSON,
    Name: r.NAME,
    ID: r.ID,
    Area: r.AREA,
    Materials: r.MATERIALS,
    Size: r.SIZE,
    Qty: r.QTY,
    Designation: r.DESIGNATION,
    Remark: r.REMARK,
    Status: r.STATUS,
    Photos_Old: r.photos_old && r.photos_old.length ? 'HAS_PHOTO' : '',
    Photos_New: r.photos_new && r.photos_new.length ? 'HAS_PHOTO' : ''
  }));

  const handlePhoto = (e, idx, which) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const materials = [...db.materials];
      materials[idx][which] = materials[idx][which] || [];
      materials[idx][which].push(reader.result);
      setDb({...db, materials});
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">Materials Management</h3>

      <form onSubmit={add} className="grid grid-cols-2 gap-2 mb-4 p-2 border rounded">
        <input placeholder="Date" value={form.DATE} onChange={e=>setForm({...form, DATE:e.target.value})} className="p-2 border" />
        <select value={form.NATIONALITY} onChange={e=>setForm({...form, NATIONALITY:e.target.value, PERSON:''})} className="p-2 border">
          <option value="INDIAN">INDIAN</option>
          <option value="OMANI">OMANI</option>
          <option value="PAKISTANI">PAKISTANI</option>
          <option value="BANGLADESH">BANGLADESH</option>
        </select>

        <select value={form.PERSON} onChange={e=> {
            const sel = e.target.value;
            const pers = (db.personnel[form.NATIONALITY] || []).find(p=>p.name===sel);
            setForm({...form, PERSON: sel, NAME: pers ? pers.name : sel, ID: pers ? pers.id : ''});
          }} className="p-2 border">
          <option value="">-- Select Person (optional) --</option>
          {personnelFor(form.NATIONALITY).map(p => <option key={p}>{p}</option>)}
        </select>

        <input placeholder="Name" value={form.NAME} onChange={e=>setForm({...form, NAME:e.target.value})} className="p-2 border" />
        <input placeholder="ID No" value={form.ID} onChange={e=>setForm({...form, ID:e.target.value})} className="p-2 border" />
        <select value={form.AREA} onChange={e=>setForm({...form, AREA:e.target.value})} className="p-2 border">
          <option>Rustaq Emergency</option>
          <option>Hazam Emergency</option>
          <option>Hoqain Emergency</option>
          <option>Khafdi Emergency</option>
          <option>Awabi Emergency</option>
          <option>Rustaq Maintenance 1</option>
          <option>Asset Security 1</option>
          <option>Hazam Maintenance 2</option>
          <option>Hazam Asset Security 2</option>
        </select>

        <input placeholder="Material" value={form.MATERIALS} onChange={e=>setForm({...form, MATERIALS:e.target.value})} className="p-2 border" />
        <input placeholder="Size" value={form.SIZE} onChange={e=>setForm({...form, SIZE:e.target.value})} className="p-2 border" />
        <input type="number" placeholder="Qty" value={form.QTY} onChange={e=>setForm({...form, QTY:parseInt(e.target.value||1)})} className="p-2 border" />
        <input placeholder="Designation" value={form.DESIGNATION} onChange={e=>setForm({...form, DESIGNATION:e.target.value})} className="p-2 border" />
        <input placeholder="Remark" value={form.REMARK} onChange={e=>setForm({...form, REMARK:e.target.value})} className="p-2 border col-span-2" />

        <div className="col-span-2">
          <button className="btn bg-green-500 text-white" type="submit">Request Material (Send)</button>
        </div>
      </form>

      <div className="flex items-center gap-2 mb-2">
        <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} className="p-2 border"/>
        <label className="ml-4"><input type="checkbox" checked={showDeleted} onChange={e=>setShowDeleted(e.target.checked)} /> Show Deleted</label>
        <button className="btn bg-blue-500 text-white" onClick={()=>exportToExcel(exportRows(filtered), 'Materials', 'Materials_List')}>Export Excel</button>
        <button className="btn bg-indigo-500 text-white" onClick={()=>exportToPDF(['SL.NO','Date','Nationality','Person','Name','ID','Area','Materials','Size','Qty','Designation','Remark','Status','Photos_Old','Photos_New'], exportRows(filtered), 'Materials_List')}>Export PDF</button>
      </div>

      <div className="overflow-auto">
        <table className="table w-full">
          <thead>
            <tr>{columns.map(c=> <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr key={idx}>
                <td>{m.SL}</td>
                <td>{m.DATE}</td>
                <td>{m.NATIONALITY}</td>
                <td>{m.PERSON}</td>
                <td>{m.NAME}</td>
                <td>{m.ID}</td>
                <td>{m.AREA}</td>
                <td>{m.MATERIALS}</td>
                <td>{m.SIZE}</td>
                <td>{m.QTY}</td>
                <td>{m.DESIGNATION}</td>
                <td>{m.REMARK}</td>
                <td>{m.STATUS}</td>
                <td>{m.photos_old && m.photos_old.length ? m.photos_old.length+' files' : ''}</td>
                <td>{m.photos_new && m.photos_new.length ? m.photos_new.length+' files' : ''}</td>
                <td>
                  {currentUser?.role && (currentUser.role==='admin' || currentUser.role==='supervisor') && (
                    <>
                      <button className="btn mr-1" onClick={()=>updateStatus(idx,'ACCEPT')}>Accept</button>
                      <button className="btn mr-1" onClick={()=>updateStatus(idx,'DECLINE')}>Decline</button>
                      <button className="btn mr-1" onClick={()=>updateStatus(idx,'RECEIVED')}>Received</button>
                    </>
                  )}
                  <div className="mt-2">
                    <input type="file" accept="image/*" onChange={e=>handlePhoto(e, idx, 'photos_old')} />
                    <div className="text-xs">Upload Old Photo</div>
                    <input type="file" accept="image/*" onChange={e=>handlePhoto(e, idx, 'photos_new')} />
                    <div className="text-xs">Upload New Photo</div>
                  </div>
                  <div className="mt-2">
                    <button className="btn bg-red-500 text-white mt-1" onClick={()=>del(idx)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h4 className="font-bold">Deleted / Trash</h4>
        {db.trash.length===0 && <div>No deleted items</div>}
        {db.trash.map((t,i)=>(
          <div key={i} className="p-2 border my-2 flex justify-between">
            <div>{t.NAME} - {t.MATERIALS} - {t.DATE}</div>
            <div>
              <button className="btn bg-green-500 text-white mr-2" onClick={()=>recover(i)}>Recover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
