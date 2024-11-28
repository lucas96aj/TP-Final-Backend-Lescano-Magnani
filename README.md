# Proyecto Backend

## ¿Qué hace cada ruta?

GET / = Saludo para verificar que la API funciona.

GET /integrantes = Devuelve todos los integrantes.

GET /integrantes/:dni = Busca un integrante específico por su DNI.

POST /integrantes/agregar = Permite agregar un nuevo integrante.

PUT /integrantes/:email = Actualiza el apellido de un integrante usando su email.

DELETE /integrantes/:dni = Elimina un integrante usando su DNI.

* * *

### 1. Iniciar el servidor
<ul>
<li>Ejecutar el servidor Express (previo a iniciar Postman): node app.js</li>
<li>Respuesta esperada: Servidor ejecutándose en http://localhost:3000</li>
</ul>

* * *

### 2. Iniciar Postman y probar ruta
<ul>
<li>Seleccioná el método HTTP correspondiente (GET, POST, PUT, DELETE).</li>
<li>Configurá la URL base: http://localhost:3000</li>
<li>Respuesta esperada: "API funcionando Ok"</li>
</ul>

### 3. Login
<ul>
<li>Seleccionar el método POST.</li>
<li>Configurar la URL: http://localhost:3000/login</li>
<li>Body (JSON): Seleccioná raw → JSON. Agregar el nombre y la contraseña:</li>
</ul>
```
{
        "username": "admin",
        "password": "1234"
}
```
<ul>
<li>Se va a devolver un mensaje de autenticación exitosa y un token.</li>
<li>En la pestaña de Authorization, seleccionar en el menú Auth Type la opción Bearer Token</li>
<li>En la misma pestaña, copiar y pegar el token recibido en la caja de la derecha.</li>
<li>Una vez hecho esto, ya se pueden probar los demás métodos.</li>
</ul>

* * *

### 4. Pruebas de métodos


#### **4.1 - GET**

4.1.1 Llamar lista de alumno
<ul>
<li>URL: http://localhost:3000/integrantes</li>
<li>Respuesta esperada: Lista de integrantes del equipo en formato JSON</li>
</ul>

4.1.2 Buscar alumno por DNI
<ul>
<li>URL: http://localhost:3000/integrantes/12345678</li>
<li>Respuesta esperada: Datos del integrante con ese DNI</li>
<li>Mensaje de error: "No se ha encontrado al integrante"</li>
</ul>

  
#### **4.2 - POST**

4.2.1 Agregar alumno
<ul>
<li>URL: http://localhost:3000/integrantes/agregar</li>
<li>Body (JSON): Seleccioná raw → JSON. Agregar el formato JSON con los datos del nuevo integrante:</li>
</ul>
```
{
    "nombre": "Anabella",
    "apellido": "Rodriguez",
    "dni": "76555433",
    "email": "rodriguez.ana@hotmail.com"
}
```
<ul>
<li>Respuesta esperada: Listado de JSON actualizado con nuevo integrante.</li>
<li>Mensaje de error: "Faltan datos"</li>
</ul>
       
#### **4.3 - PUT**

4.3.1 Actualizar apellido identificando por email
<ul>
<li>URL: http://localhost:3000/integrantes/messiento10@gmail.com</li>
<li>Body (JSON): Seleccioná raw → JSON. ASeleccioná raw → JSON. Agregar en formato JSON:</li>
</ul> 
```
{
        "apellido": "Perez"
}
```
<ul>
<li>Respuesta esperada: Elemento de JSON con datos del integrante actualizados (Rosario Perez)</li>
<li>Mensaje de error: "No se encontró alumno que responda a esos datos"</li>
</ul>

#### **4.4 - DELETE**

4.4.1 Eliminar un integrante por DNI
<ul>
<li>URL: http://localhost:3000/integrantes/76555423</li>
<li>Respuesta esperada: Listado de JSON actualizado sin el integrante con el DNI ingresado.</li>
<li>Mensaje de error: "No ha encontrado lo que ingresaste"</li>
</ul>
