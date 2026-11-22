async function crear_tabla_mis_coches() {
    try {

        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        const respuesta = await fetch("https://practicaprogramacionweb.duckdns.org/cars", {
            headers: { Authorization: "Bearer " + token }
        });

        if (!respuesta.ok) {
            alert("Error al obtener los coches");
            return;
        }

        const coches = await respuesta.json();
        const lista = document.getElementById("tabla_mis_coches");
        lista.innerHTML = "";
    
        coches.forEach(function(coche) {
            if (coche.idUser == email){
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
                const celdaBotonn = fila.insertCell();
                const boton_modificar = document.createElement("button");
                boton_modificar.textContent = "Modificar";
                boton_modificar.type = "button";

                boton_modificar.onclick = function() {
                    modificar_coche(coche._id,coche);
                };
                celdaBotonn.appendChild(boton_modificar)

                const celdaBoton = fila.insertCell();
                const boton = document.createElement("button");
                boton.textContent = "Eliminar";
                boton.type = "button";

                boton.onclick = function() {
                    eliminar_coche(coche._id);
                };
                celdaBoton.appendChild(boton)
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

async function eliminar_coche(id_coche){
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    let url = "https://practicaprogramacionweb.duckdns.org/cars/" + id_coche

    fetch(url, {
        method: "DELETE",
        headers: {
            "accept": "*/*",
            "Authorization": "Bearer " + token,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
}
async function modificar_coche(id_coche, coche) {
    const token = localStorage.getItem("token");

    const modelo = document.getElementById("modelo").value;
    const precio = document.getElementById("precio").value;
    const km = document.getElementById("km").value;
    const descripcion = document.getElementById("descripcion").value;
    const categoria = document.getElementById("categoria").value;
    const imagen = document.getElementById("imagen").value;

    const coche_modificado = {
        name: modelo || coche.name,
        price: precio !== "" ? Number(precio) : coche.price,
        km: km !== "" ? Number(km) : coche.km,
        category: categoria || coche.category,
        description: descripcion || coche.description,
        image: imagen || coche.image,
        idUser: coche.idUser
    };

    const JSON_coche_modificado = JSON.stringify(coche_modificado);
    let url = "https://practicaprogramacionweb.duckdns.org/cars/" + id_coche;

    fetch(url, {
        method: "PUT",
        headers: {
            "accept": "*/*",
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        },
        body: JSON_coche_modificado
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al modificar el coche");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        crear_tabla_mis_coches();
    })
    .catch(error => {
        console.error(error);
    });
}
