import React, {useState, useEffect} from 'react';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';
import dayjs from 'dayjs';

const SAMPLE_TOOLS = [
  'Ring Spanner 07','Ring Spanner 08','Ring Spanner 09','Ring Spanner 10','Ring Spanner 11','Ring Spanner 12','Ring Spanner 13','Ring Spanner 14','Ring Spanner 15','Ring Spanner 16','Ring Spanner 17','Ring Spanner 18','Ring Spanner 19','Ring Spanner 20','Ring Spanner 22','Ring Spanner 24','Ring Spanner 26','Ring Spanner 28','Ring Spanner 30','Ring Spanner 32',
  'Open End Spanner 07','Open End Spanner 08','Low Voltage Tester (Approved by HSE)','Live Line Tester (11 KV and 33 KV)','Fiberglass Insulated Ladder','Adjustment Spanner','Lug Crimping tool','Knife','Safety Belt (Pole Climbing)','Safety Harness (Pole Climbing)','LV Rubber Gloves','11 KV Rubber Gloves','33 KV Rubber Gloves','Clamp Meter','Operating Rod','Spot Light','Earth Kit','Voltmeter','Wire Cutter','Combination Pliers','Side cutting Pliers','Nose Pliers','Hammer','Fire Distinguisher','First Aid tools','Pole Climber (Wooden)','Pole Climber (Concrete)','Hand shovel','Drilling Set','Hacksaw','Frame Air Blower','Earth resistance Meter','Screw Driver Set Heavy Duty','Measurement Tape','PHASE rotation tester','Torch','Safety Cone barriers with Plastic Chain'
];

const initial = ()=>{
  const raw = localStorage.getItem('kmt_materials');
  if(raw) return JSON.parse(raw);
  const demo = [{
    sl:1, date:'2025-11-10', name:'MARIAPPAN RAJA', id:'123458335', material:'T-SHIRT', size:'XXL', qty:1, area:'Rustaq Emergency', status:'In Progress', isDeleted:false, photos:[]
  }];
  localStorage.setItem('kmt_materials', JSON.stringify(demo));
  return demo;
};

export default function Materials({user}){
  const [materials,setMaterials]=useState(initial);
  const [form,setForm]=useState({date:dayjs().format('YYYY-MM-DD'), name:user.name, id:'', material:'', size:'', qty:1, area:'Rustaq Emergency', remark:''});
  const [filterArea,setFilterArea]=useState('All');
  const [showDeleted,setShowDeleted]=useState(false);

  useEffect(()=> localStorage.setItem('kmt_materials', JSON.stringify(materials)), [materials]);

  function addMaterial(e){
    e.preventDefault();
    const next = {...form, sl: materials.length? Math.max(...materials.map(m=>m.sl))+1 : 1, status:'Requested', isDeleted:false, photos:[]};
    setMaterials([next, ...materials]);
    setForm({...form, material:'', size:'', qty:1, remark:''});
  }

  function toggleDelete(sl){
    setMaterials(materials.map(m=> m.sl===sl ? {...m, isDeleted: !m.isDeleted} : m));
  }

  function recoverAll(){
    setMaterials(materials.map(m=> ({...m, isDeleted:false})));
  }

  function markReceived(sl){
    setMaterials(materials.map(m=> m.sl===sl ? {...m, status:'Completed', receivedBy:user.name, receivedDate: dayjs().format('YYYY-MM-DD')} : m));
  }

  function acceptRequest(sl){
    setMaterials(materials.map(m=> m.sl===sl ? {...m, status:'Accepted'} : m));
  }
  function declineRequest(sl){
    setMaterials(materials.map(m=> m.sl===sl ? {...m, status:'Declined'} : m));
  }

  function uploadPhoto(sl, file){
    const reader = new FileReader();
    reader.onload = (ev)=>{
      setMaterials(materials.map(m=> m.sl===sl ? {...m, photos:[...(m.photos||[]), ev.target.result]} : m));
    };
    reader.readAsDataURL(file);
  }

  const visible = materials.filter(m => (showDeleted? true : !m.isDeleted) && (filterArea==='All' ? true : m.area===filterArea));

  const columns = ['sl','date','name','id','material','size','qty','area','status'];

  return (
    <div>
      <h3>Materials Management</h3>
      <div className='notice'>Areas: Rustaq Emergency, Hazam Emergency, Hoqain Emergency, Khafdi Emergency, Awabi Emergency, Rustaq Maintenance 1, Asset Security 1, Hazam Maintenance 2, Hazam Asset Security 2</div>
      <form onSubmit={addMaterial}>
        <div className='form-row'>
          <input className='input' type='date' value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          <input className='input' placeholder='Name' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className='input' placeholder='ID No' value={form.id} onChange={e=>setForm({...form, id:e.target.value})} />
          <select className='select' value={form.material} onChange={e=>setForm({...form, material:e.target.value})}>
            <option value=''>-- Material --</option>
            {SAMPLE_TOOLS.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
          <input className='input small' placeholder='Size' value={form.size} onChange={e=>setForm({...form, size:e.target.value})} />
          <input className='input small' type='number' min='1' value={form.qty} onChange={e=>setForm({...form, qty: parseInt(e.target.value || '1')})} />
        </div>
        <div className='form-row'>
          <select className='select' value={form.area} onChange={e=>setForm({...form, area:e.target.value})}>
            <option>Rustaq Emergency</option><option>Hazam Emergency</option><option>Hoqain Emergency</option><option>Khafdi Emergency</option><option>Awabi Emergency</option><option>Rustaq Maintenance 1</option><option>Asset Security 1</option><option>Hazam Maintenance 2</option><option>Hazam Asset Security 2</option>
          </select>
          <input className='input' placeholder='Remark' value={form.remark} onChange={e=>setForm({...form, remark:e.target.value})} />
          <button className='button' type='submit'>Request Material</button>
        </div>
      </form>

      <div style={{marginTop:12}}>
        <label>Filter Area: </label>
        <select className='select' value={filterArea} onChange={e=>setFilterArea(e.target.value)}>
          <option>All</option><option>Rustaq Emergency</option><option>Hazam Emergency</option><option>Hoqain Emergency</option><option>Khafdi Emergency</option><option>Awabi Emergency</option><option>Rustaq Maintenance 1</option><option>Asset Security 1</option><option>Hazam Maintenance 2</option><option>Hazam Asset Security 2</option>
        </select>
        <label style={{marginLeft:12}}><input type='checkbox' checked={showDeleted} onChange={e=>setShowDeleted(e.target.checked)} /> Show deleted</label>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToExcel(visible, 'Materials', 'Materials_List')}>Export Excel</button>
        <button className='button' style={{marginLeft:8}} onClick={()=>exportToPDF(columns, visible, 'Materials_List')}>Export PDF</button>
        <button className='button' style={{marginLeft:8}} onClick={recoverAll}>Recover All</button>
      </div>

      <table className='table'>
        <thead><tr><th>SL</th><th>Date</th><th>Name</th><th>ID</th><th>Material</th><th>Size</th><th>Qty</th><th>Area</th><th>Status</th><th>Photos</th><th>Actions</th></tr></thead>
        <tbody>
          {visible.map(m=> (
            <tr key={m.sl}>
              <td>{m.sl}</td><td>{m.date}</td><td>{m.name}</td><td>{m.id}</td><td>{m.material}</td><td>{m.size}</td><td>{m.qty}</td><td>{m.area}</td><td>{m.status}</td>
              <td>{(m.photos||[]).map((p,i)=>(<img key={i} src={p} alt='photo' className='photo-thumb' />))}</td>
              <td>
                {user.role==='Admin' && <><button className='button' onClick={()=>acceptRequest(m.sl)}>Accept</button><button className='button' style={{marginLeft:6}} onClick={()=>declineRequest(m.sl)}>Decline</button></>}
                {user.role==='Supervisor' && <button className='button' onClick={()=>markReceived(m.sl)}>Mark Received</button>}
                <label style={{display:'block', marginTop:6}}>Add Photo<input type='file' style={{display:'block'}} onChange={e=>uploadPhoto(m.sl, e.target.files[0])} /></label>
                <button style={{marginTop:6}} className='button' onClick={()=>toggleDelete(m.sl)}>{m.isDeleted?'Recover':'Delete'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
          }
