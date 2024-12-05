var paises = [];

//Función para el nav en movile
window.document.getElementById('burger').addEventListener('click', function(){
    document.getElementById('burger').classList.toggle('active');
    document.getElementById('navegacion').classList.toggle('active');
}, false);
//Obtener los paises
async function  ObtenerPaises(){
    const resultado = await fetch(`https://restcountries.com/v3.1/all`);
    const datos = await resultado.json();
    return datos;
}
//Obtener un país por codigo cca2
async function ObtenerPais(cca2){
    const resultado = await fetch(`https://restcountries.com/v3.1/alpha?codes=${cca2}`);
    const datos = await resultado.json();
    return datos;
}
//Recuperar el valor del txt y cmb del session storage
(function (){
    const texto = window.document.getElementById('txtEntrada');
    const cmb = window.document.getElementById('cmbEntrada');
    if(texto != null){
        texto.value = sessionStorage.getItem("texto");
    }
    else if(cmb != null){
        cmb.value = sessionStorage.getItem("region");
    }
})();
//Obtener los paises del session storage o mediante una solicitud 
(async function (){
    try {
        if (document.getElementById('principal') == null){
            paises = JSON.parse(localStorage.getItem('paises'));
            //Si no se encuentra en el session storage se hace una solicitud
            if(paises == null || paises.length < 200){
                const resultado = await ObtenerPaises();
                paises = resultado.map((valor) => {//Se guarda solo lo necesario
                    return {
                        'nombre': valor.translations.spa.common,
                        'cca2': valor.cca2,
                        'region': valor.region
                    }
                });
                localStorage.setItem('paises', JSON.stringify(paises));
                console.log('solicitud servidor');
            }
            else{
                console.log('extracción local');
            }
    
            //Dependiendo de la página se hace un filtrado u otro
            const paisesNombre = document.getElementById("paisesNombre");
            if(paisesNombre != null){
                FiltrarNombre();
            }
            else{
                FiltrarRegion();
            }
        }
    } catch (error) {
        alert('Error al cargar los paises');
    }
})();
//Pintar los paises
function PintarPaises(objeto, elemento){
    const paisesHTML = document.getElementById(elemento); 
    paisesHTML.innerHTML = "";
    objeto.forEach(element => {
        const pais = document.createElement('section');

        pais.setAttribute('class', 'tarjeta');
        pais.addEventListener('click', function(){
            MostrarModal(element.cca2);
        }, false);
        pais.innerHTML = `<h3 class="texto">${element.nombre}</h3>
                        <p class="texto">Código: ${element.cca2}</p>`

        paisesHTML.appendChild(pais);
    });
}
//Filtrar los paises por el nombre
function FiltrarNombre(){
    const valorEntrada = window.document.getElementById('txtEntrada').value;
    sessionStorage.setItem("texto", valorEntrada);//Se guarda el valor de entrada en el session storage
    PintarPaises(paises.filter((valor)=>valor.nombre.toLowerCase().includes(valorEntrada.toLowerCase())), 'paisesNombre');
}
//Filtrar los paises por la región
function FiltrarRegion(){
    const valorEntrada = window.document.getElementById('cmbEntrada').value;
    sessionStorage.setItem("region", valorEntrada);//Se guarda el valor de entrada en el session storage
    PintarPaises(paises.filter((valor)=>valor.region.toLowerCase().includes(valorEntrada.toLowerCase())), 'paisesRegion');
}
//Filtrar los paises al dar enter en el txt
function FiltrarEnter(evento){
    if (evento.key === 'Enter'){
        FiltrarNombre();
    }
}
//Mostrar los detalles del país
async function MostrarModal(cca2){
    try {
        const modal = document.getElementById('modal');
        const pais = await ObtenerPais(cca2);
        const monedas = Object.values(pais[0].currencies??'No definido');
        const idiomas = Object.values(pais[0].languages??'No definido');
        modal.innerHTML = `<article class="modal">
                                <p class="texto"><strong>Nombre:</strong> ${pais[0].translations.spa.common??'No definido'}</p>
                                <p class="texto"><strong>Nombre oficial:</strong> ${pais[0].translations.spa.official??'No definido'}</p>
                                <p class="texto"><strong>Capital:</strong> ${pais[0].capital??'No definido'}</p>
                                <p class="texto"><strong>Moneda:</strong> ${monedas[0].name??'No definido'} ${monedas[0].symbol??''}</p>
                                <p class="texto"><strong>Idioma:</strong> ${idiomas[0]??'No definido'}</p>
                                <p class="texto"><strong>Región:</strong> ${pais[0].region??'No definido'}</p>
                                <p class="texto"><strong>Población:</strong> ${pais[0].population.toLocaleString('es-ES')??'No definido'}
                                <p class="texto"><strong>Superficie:</strong> ${pais[0].area.toLocaleString('es-ES')+'km²'??'No definido'}</p>
                                <p class="texto"><strong>Código:</strong> ${pais[0].cca2??'No definido'}</p>
                                <button class="btn modal-btn">Cerrar</button>
                                <div class="fondo"></div>
                                <img src="${pais[0].flags.png}" alt="${pais[0].flags.alt}" class="bandera">
                            </article>`;
        //Evento para cerrar el modal
        modal.childNodes[0].childNodes[18].addEventListener('click', function(){

            modal.childNodes[0].style.animationName = 'animacion4';
            setTimeout(() => {
                modal.innerHTML = ``;
            }, 170);
        }, false);
        
    } catch (error) {
        alert('Error mostrando los detalles');
    }
}
