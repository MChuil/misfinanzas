let movimientos;
movimientos = localStorage.getItem('movimientos');  //leer los movimientos guardados en el localStorage
// if(movimientos){
//     movimientos = JSON.parse(movimientos); //convertir el string a un array de objetos
// }else{
//     movimientos = []; //si no hay movimientos, inicializar un array vacío
// }
movimientos = (movimientos) ? JSON.parse(movimientos) : []; // ternario para inicializar movimientos

document.addEventListener('DOMContentLoaded', function() { //Esperar a que cargue todo el html
    renderizar(); //Llamar a la función para mostrar los movimientos al cargar la página
});

// Elementos del DOM (Documento Object Model)
const form = document.querySelector("#form");
const descripcionInput = document.querySelector("#descripcion");
const montoInput = document.querySelector("#monto");
const categoriaSelect = document.querySelector("#categoria");
const tipoSelect = document.querySelector("#tipo");
const lista = document.querySelector("#lista");
const balance = document.querySelector("#balance");

const selectFiltro = document.querySelector("#filtroCategoria");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnLimpiar = document.querySelector("#btnLimpiar");

const totalIngresosSpan = document.querySelector("#totalIngresos");
const totalGastosSpan = document.querySelector("#totalGastos");
const totalFiltroSpan = document.querySelector("#totalFiltro");

//Eventos
form.addEventListener("submit", agregarMovimiento);
btnFiltrar.addEventListener("click", filtrar)
btnLimpiar.addEventListener("click", renderizar);

//Funciones
function agregarMovimiento(e){ //e es la referencia al evento
    e.preventDefault(); //prevenir el comportamiento por defecto del formulario

    let descripcion = descripcionInput.value.trim(); //trim elimina espacios en blanco al inicio y al final
    let monto = Number(montoInput.value);
    let tipo = tipoSelect.value;
    let categoria = categoriaSelect.value;

    //Validar los datos
    // if(descripcion == ""){
    //     alert("La descripción no puede estar vacía");
    //     return;
    // }

    // if(monto<=0){
    //     alert("El monto debe ser un número mayor que cero");
    //     return;
    // }

    // if(tipo == ""){
    //     alert("Debe seleccionar un tipo de movimiento");
    //     return;
    // }


    if(descripcion == "" || monto  <= 0 || tipo=="" || categoria == ""){
        alert("Por favor complete todos los campos correctamente");
        return;
    }

    // TAREA: mejorar el diseño con css

    //Crear el objeto movimiento
    const movimiento = {
        id: Date.now(), //id único basado en la fecha y hora actual
        descripcion: descripcion,
        monto: monto,
        categoria: categoria,
        tipo: tipo,
    };

    //Agregar el movimiento al array
    movimientos.push(movimiento);

    //Guardar los movimientos en el localStorage
    guardar();

    //Actualizar la interfaz
    renderizar();

    //Limpiar el formulario
    form.reset();
}


function guardar(){
    localStorage.setItem('movimientos', JSON.stringify(movimientos)); //convertir el array a string y guardarlo
}


function renderizar(){
    lista.innerHTML = ""; //Limpiar la lista

    movimientos.forEach(mov => {
        const li = document.createElement("li");
        li.classList.add(mov.tipo);
        li.innerHTML = `<div>${mov.descripcion} - ${mov.monto} <br><small>${mov.categoria}</small></div> <button onclick="eliminar(${mov.id})">X</button>`;
        lista.appendChild(li);
    });

    calcularBalance();

    totalFiltroSpan.innerHTML= ""; //Limpiar el total del filtro al renderizar toda la lista
    selectFiltro.value = ""; //Resetear el select del filtro
}

function eliminar(id){
    //Filtrar el array para eliminar el movimiento con el id dado
    movimientos = movimientos.filter(mov => mov.id != id);
    guardar();
    renderizar();
}

function calcularBalance(){
    let ingresos = 0;
    let gastos = 0;
    movimientos.forEach(mov => {
        if(mov.tipo == "ingreso"){
            ingresos += mov.monto;
        }else{
            gastos += mov.monto;
        }
    });
    let total = ingresos - gastos;
    totalIngresosSpan.textContent = ingresos.toFixed(2);
    totalGastosSpan.textContent = gastos.toFixed(2);

    if(total>=0){
        balance.innerHTML = `<span class="mas">${total.toFixed(2)}</span>` ; //tofiexed(2) para mostrar 2 decimales
    }else{
         balance.innerHTML = `<span class="menos">${total.toFixed(2)}</span>` ; //tofiexed(2) para mostrar 2 decimales
    }
}

function filtrar(){
    let categoriaFiltro = selectFiltro.value;
    if(categoriaFiltro == ""){
        alert("Seleccione una categoría para filtrar");
        return;
    }

    lista.innerHTML = ""; //Limpiar la lista
    const movimientosFiltrados = movimientos.filter(mov => mov.categoria == categoriaFiltro);
    let totalFiltro = 0;
    movimientosFiltrados.forEach(mov => {
        const li = document.createElement("li");
        li.classList.add(mov.tipo);
        li.innerHTML = `<div>${mov.descripcion} - ${mov.monto} <br><small>${mov.categoria}</small></div> <button onclick="eliminar(${mov.id})">X</button>`;
        lista.appendChild(li);
        totalFiltro += mov.monto;
    });

    totalFiltroSpan.innerHTML= `Total para "${categoriaFiltro}": $${totalFiltro.toFixed(2)}`;

}