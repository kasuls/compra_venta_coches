async function crear_tabla_todos_los_coches() {
    try {

        const token = localStorage.getItem("token");

        const respuesta = await fetch("https://practicaprogramacionweb.duckdns.org/cars", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!respuesta.ok) {
            alert("Error al obtener los coches");
            return;
        }

        const coches = await respuesta.json();
        const lista = document.getElementById("tabla_todos_los_coches");
        lista.innerHTML = "";

        coches.forEach(function(coche) {
            const fila = lista.insertRow();

            const posiciones =[coche.name, coche.price, coche.km, coche.description, coche.category, coche.state]

            posiciones.forEach(function(valor) {
                fila.insertCell().textContent = valor;
            });

            const celdaImagen = fila.insertCell();

            if (coche.image) {
                const img = document.createElement("img");
                img.src = coche.image;
                img.alt = "Imagen de " + coche.name;
                img.className = "imagen-coche";
                celdaImagen.appendChild(img);
            }
            const celdaBoton = fila.insertCell();
            const boton = document.createElement("button");
            boton.className = "boton-carrito";
            boton.textContent = "Añadir al carrito";
            boton.type = "button";
            boton.className = "boton-carrito";

            boton.onclick = function() {
                carrito(coche);
            };

            celdaBoton.appendChild(boton);
            
        });

    } catch (error) {
        console.error("Error:", error);
    }   
}
function carrito(coche) {

    let coches_carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    coches_carrito.push(coche);

    localStorage.setItem("carrito", JSON.stringify(coches_carrito));

    alert("Coche añadido al carrito");
    
}
