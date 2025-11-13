# 🌐 Frontend del Concesionario de Autos (Angular)

Este proyecto es el **frontend web del sistema de concesionario de autos**, desarrollado en **Angular 17**.
Consume la API creada en FastAPI y permite manejar:

✅ Clientes
✅ Empleados
✅ Administradores
✅ Autos
✅ Facturas
✅ Mantenimientos

La interfaz permite **listar, registrar, filtrar y eliminar datos** gracias a una comunicación en tiempo real con el backend.

---

## 📂 Estructura del Proyecto

```
frontend/
│── src/
│   ├── app/
│   │   ├── services/             # Servicios para consumir la API
│   │   ├── modules/              # Componentes organizados por entidad
│   │   │   ├── clientes/
│   │   │   ├── empleados/
│   │   │   ├── autos/
│   │   │   ├── admin/
│   │   ├── layout/               # Plantillas y diseño del dashboard
│   │   ├── models/               # Interfaces TypeScript
│   │   ├── environments/         # Configuración de URLs API
│   ├── assets/
│   ├── index.html
│   ├── main.ts
│
│── package.json                  # Dependencias y scripts
│── angular.json                  # Configuración del proyecto Angular
│── README.md
```

---

## ✅ Requisitos Previos

* Node.js **16+**
* Angular CLI
* Backend corriendo en `http://localhost:8000`

Instalar Angular CLI (si no lo tienes):

```bash
npm install -g @angular/cli
```

---

## 📦 Instalación

1. Entrar al proyecto

```bash
cd frontend
```

2. Instalar dependencias

```bash
npm install
```

---

## 🔗 Configuración de la API

El proyecto usa un archivo de entorno para conectarse con FastAPI:

📍 `src/app/environments/environments.ts`

Ejemplo configurado:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000'
};
```

Si tu backend corre en otra dirección, cámbiala aquí.

✅ Gracias a esto, Angular puede consumir los endpoints:

* `GET /clientes`
* `GET /empleados`
* `GET /autos`
* `DELETE /clientes/{id}`
* etc.

---

## 🚀 Ejecutar el proyecto

```bash
ng serve
```

Ir al navegador:

```
http://localhost:4200
```

✅ Se mostrará el panel administrativo donde podrás navegar por el menú lateral y gestionar entidades.

---

## 🧩 Funcionalidades Principales

| Módulo              | Funciones disponibles                       |
| ------------------- | ------------------------------------------- |
| **Clientes**        | Listar, buscar, crear, eliminar             |
| **Empleados**       | Listar, registrar, eliminar                 |
| **Autos**           | Mostrar autos disponibles, vender, eliminar |
| **Administradores** | Gestión básica de usuarios admins           |
| **Facturas**        | Consultar ventas registradas                |
| **Mantenimientos**  | Registrar y consultar servicios realizados  |

---

## 🔧 Comunicación con Backend

El frontend se comunica mediante **servicios Angular** ubicados en:

```
src/app/services/
```

Ejemplo de llamada:

```ts
listarClientes() {
  return this.http.get<Cliente[]>(`${environment.apiUrl}/clientes`);
}
```

Cada módulo usa **Reactive Forms**, validaciones y modales para crear o editar registros.

---

## ✅ Conexión exitosa con el Backend FastAPI

Para que Angular pueda comunicarse con Python, en el backend se habilitó CORS:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Sin esto, el navegador bloqueaba las peticiones de Angular.

---

## 🧪 Pruebas

* Abrir consola del navegador (F12 → Console)
* Navegar por clientes, autos, empleados
* Ver llamadas exitosas a `http://localhost:8000/...`

Si aparece un error CORS o 404, revisar:
✅ Backend encendido
✅ URL correcta en `environments.ts`

---

## 👨‍💻 Autores

* Juan Pablo Gutiérrez Vargas
* Juan Felipe Ospina Agudelo

---

## 📜 Licencia

Proyecto académico desarrollado con fines educativos.

---
