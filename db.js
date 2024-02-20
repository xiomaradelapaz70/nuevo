var db;
const funcdb = ()=>{
    let indexDB = indexedDB.open('db_sistema',1);
    indexDB.onupgradeneeded = e=>{
        let req = e.target.result,
            tblregistro = req.createObjectStore('registros',{keyPath:'idregistro'}),
            tblmateria = req.createObjectStore('materias',{keyPath:'idmateria'}),
            tblalumno = req.createObjectStore('alumnos',{keyPath:'idalumno'});
        tblregistro.createIndex('idregistro','idregistro',{unique:true});
        tblregistro.createIndex('codigo','codigo',{unique:true});
        tblmateria.createIndex('idmateria','idmateria',{unique:true});
        tblmateria.createIndex('codigo','codigo',{unique:true});
        tblalumno.createIndex('idalumno','idalumno',{unique:true});
        tblalumno.createIndex('codigo','codigo',{unique:true});
    };
    indexDB.onsuccess = e=>{
        db = e.target.result;
    };
    indexDB.onerror = e=>{
        console.error('Error al crear la base de datos', e.message());
    };
}, abrirStore = (store, modo)=>{
    let ltx = db.transaction(store, modo);
    return ltx.objectStore(store);
};
funcdb();