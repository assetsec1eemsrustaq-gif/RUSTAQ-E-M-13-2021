// src/utils/storage.js
const KEY = 'kmtc_data_v2';
const defaultData = {
  users: [
    { username: 'KMTC', password: 'KMTC123', name: 'KMTC Staff', role: 'staff' },
    { username: 'SUPER', password: 'KMTC123', name: 'Supervisor', role: 'supervisor' },
    { username: 'ADMIN', password: 'KMTC123', name: 'Administrator', role: 'admin' }
  ],
  personnel: {
    INDIAN: [
      { name: 'GOPALAKRISHANAN ETTAIYAH', designation: 'CEP/SUPERVISOR', id: '65748525' },
      { name: 'MARIAPPAN RAJA', designation: 'TECHNICIAN', id: '123458335' },
      { name: 'IYAPPAN ARUMUGAM', designation: 'JOINTER', id: '90785788' },
      { name: 'ARAVIND MUTHAIYAN', designation: 'TECHNICIAN', id: '117123432' },
      { name: 'SATHISHKU MARMURUGAN', designation: 'LINEMAN', id: '123285835' },
      { name: 'AHAMED AJITH ALI ABUL HASAN', designation: 'LINEMAN', id: '139093088' },
      { name: 'VELMURUGAN SUBBAIYAH', designation: 'LINEMAN', id: '89860127' },
      { name: 'SIVA SANKAR MUTHU', designation: 'LINEMAN', id: '123624655' },
      { name: 'AKHILESH VASUKUTTY', designation: 'TECHNICIAN', id: '84541923' },
      { name: 'SHEIK SYED ALI IBRAHIM', designation: 'TECHNICIAN', id: '117977928' },
      { name: 'SHIJU ABRAHAM', designation: 'LINEMAN', id: '88854194' },
      { name: 'MURUGAN PERIYASAMY', designation: 'LINEMAN', id: '98517423' },
      { name: 'SUDALAIMANI MADASAMY', designation: 'LINEMAN', id: '123624655' },
      { name: 'KUMAR GANAPATHY', designation: 'TECHNICIAN', id: '111035057' },
      { name: 'DILLIEP KUMAR DIPPANA', designation: 'LINEMAN', id: '80780342' },
      { name: 'SHAKIB ANAYET ULLAH', designation: 'LINEMAN', id: '122563403' },
      { name: 'KUTHALINGAM NAMBIRAJAN', designation: 'TECHNICIAN', id: '139093055' },
      { name: 'POOL PANDY AYADURAI', designation: 'TECHNICIAN', id: '91627133' },
      { name: 'SURESH RAJENDRAN', designation: 'LINEMAN', id: '114005634' },
      { name: 'KARUNAIAMUTHAN GUNASEKARAN', designation: 'TECHNICIAN', id: '101687199' },
      { name: 'AKHIL CHANDRAN', designation: 'TECHNICIAN', id: '121906831' },
      { name: 'AMOS PAULRAJ', designation: 'TECHNICIAN', id: '108495568' },
      { name: 'FAYYAZ HAIDER', designation: 'LINEMAN', id: '136264027' },
      { name: 'SARAVANAN PERUMAL', designation: 'TECHNICIAN', id: '96800893' },
      { name: 'VAIGUNDA KRISHNAN ETTAIYAH', designation: 'LINEMAN', id: '70722261' },
      { name: 'RAJESH KANNAN KATHAPPAN', designation: 'TECHNICIAN', id: '89733495' },
      { name: 'RAJKUMAR JEYARAMAN', designation: 'LINEMAN', id: '110635673' }
    ],
    OMANI: [
      { name: 'NIL', designation: 'DRIVER', id: '' }
    ],
    PAKISTANI: [
      { name: 'FAYYAZ HAIDER', designation: 'LINEMAN', id: '136264027' }
    ],
    BANGLADESH: [
      { name: 'SHAKIB ANAYET ULLAH', designation: 'LINEMAN', id: '122563403' }
    ]
  },
  materials: [],
  ppe: [],
  leaves: [],
  cancels: [],
  trash: []
};

export function loadData(){
  try {
    const raw = localStorage.getItem(KEY);
    if(!raw) {
      localStorage.setItem(KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch(e){
    console.error(e);
    localStorage.setItem(KEY, JSON.stringify(defaultData));
    return defaultData;
  }
}
export function saveData(data){
  localStorage.setItem(KEY, JSON.stringify(data));
}
