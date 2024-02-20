Vue.component('v-select-materia', VueSelect.VueSelect);
Vue.component('componente-registros', {
    data() {
        return {
            valor:'',
            registros:[],
            materias:[],
            accion:'nuevo',
            registro:{
                materia:{
                    id:'',
                    label:''
                },
                idregistro: new Date().getTime(),
                codigo:'',
                nombre:'',
                marca:'',
                presentacion:'',
                precio:0.0,
                foto:'',
            }
        }
    },
    methods:{
        buscarregistro(e){
            this.listar();
        },
        eliminarregistro(idregistro){
            if( confirm(`Esta seguro de elimina el registro?`) ){
                let store = abrirStore('registros', 'readwrite'),
                query = store.delete(idregistro);
            query.onsuccess = e=>{
                this.nuevoregistro();
                this.listar();
            };
            }
        },
        modificarregistro(registro){
            this.accion = 'modificar';
            this.registro = registro;
        },
        guardarregistro(){
            // Validar si la materia ha sido seleccionada
            if(this.registro.materia.id === '' || this.registro.materia.label === ''){
                console.error("Por favor seleccione una materia");
                return;
            }
        
            // Validar si el alumno ya está registrado
            if(!this.alumnoExiste(this.registro.materia.id)){
                console.error("El alumno seleccionado no existe en la base de datos");
                return;
            }
        
            // Almacenar el registro en la base de datos
            let store = abrirStore('registros', 'readwrite'),
                query = store.put({...this.registro});
            query.onsuccess = e=>{
                this.nuevoregistro();
                this.listar();
            };
            query.onerror = e=>{
                console.error('Error al guardar en registros', e.message());
            };
        },
       alumnoExiste(idAlumno) {
            // Simulación de una lista de IDs de alumnos existentes en la base de datos
            const alumnosExistentes = ['1', '2', '3', '4', '5'];
        
            // Verificar si el ID del alumno está en la lista de alumnos existentes
            if (alumnosExistentes.includes(idAlumno)) {
                return true; // El alumno existe en la base de datos
            } else {
                return false; // El alumno no existe en la base de datos
            }
       
        },
        nuevoregistro(){
            this.accion = 'nuevo';
            this.registro = {
                materia:{
                    id:'',
                    label:''
                },
                idregistro: new Date().getTime(),
                codigo:'',
                nombre:'',
                marca:'',
                presentacion:'',
                precio:0.0
            }
        },
        listar(){
            let storeCat = abrirStore('materias', 'readonly'),
                dataCat = storeCat.getAll();
            dataCat.onsuccess = resp=>{
                this.materias = dataCat.result.map(materia=>{
                    return {
                        id: materia.idmateria,
                        label:materia.nombre
                    }
                });
            };
            let store = abrirStore('registros', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.registros = data.result
                    .filter(registro=>registro.codigo.includes(this.valor) || 
                    registro.nombre.toLowerCase().includes(this.valor.toLowerCase()) || 
                    registro.marca.toLowerCase().includes(this.valor.toLowerCase()) || 
                    registro.presentacion.toLowerCase().includes(this.valor.toLowerCase()));
            };
        }
    },
    template: `
        <div class="row">
            <div class="col col-md-6">
                <div class="card">
                    <div class="card-header text-bg-dark">REGISTRO DE REGISTROS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">materia</div>
                            <div class="col col-md-3">
                                <v-select-materia required v-model="registro.materia" 
                                    :options="materias">Por favor seleccione una materia</v-select-materia>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">CODIGO</div>
                            <div class="col col-md-3">
                                <input v-model="registro.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">NOMBRE</div>
                            <div class="col col-md-5">
                                <input v-model="registro.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">SEDE</div>
                            <div class="col col-md-5">
                                <input v-model="registro.marca" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">MODALIDAD</div>
                            <div class="col col-md-3">
                                <input v-model="registro.presentacion" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">PRECIO</div>
                            <div class="col col-md-3">
                                <input v-model="registro.precio" type="number" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">
                                <img :src="registro.foto" width="50"/>
                            </div>
                            <div class="col col-md-4">
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">Seleccione la foto</label>
                                    <input class="form-control" type="file" id="formFile" 
                                        accept="image/*" onChange="seleccionarFoto(this)">
                                </div>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col">
                                <button @click.prevent.default="guardarregistro" class="btn btn-success">GUARDAR</button>
                                <button @click.prevent.default="nuevoregistro" class="btn btn-warning">NUEVO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-md-6">
                <div class="card text-bg-dark">
                    <div class="card-header">LISTADO DE REGISTROS</div>
                    <div class="card-body">
                        <form id="frmregistro">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="6">
                                            <input placeholder="codigo, nombre, sede, modalidad" type="search" v-model="valor" @keyup="buscarregistro" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>materia</th>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>SEDE</th>
                                        <th>MODALIDAD</th>
                                        <th>PRECIO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarregistro(registro)" v-for="registro in registros" :key="registro.idregistro">
                                        <td>{{registro.materia.label}}</td>
                                        <td>{{registro.codigo}}</td>
                                        <td>{{registro.nombre}}</td>
                                        <td>{{registro.marca}}</td>
                                        <td>{{registro.presentacion}}</td>
                                        <td>{{registro.precio}}</td>
                                        <td><button @click.prevent.default="eliminarregistro(registro.idregistro)" class="btn btn-danger">del</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
});
