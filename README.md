# Predicción de Precio de Autos Usados

Este proyecto utiliza un modelo de regresión lineal para predecir el precio de un auto usado en USD, basado en características como año de fabricación, kilometraje, cilindrada, tipo de combustible, transmisión, número de dueños anteriores y si tiene seguro vigente.

## Tecnologías utilizadas

- **Backend**: FastAPI + Scikit-Learn + joblib
- **Frontend**: React + TailwindCSS
- **Modelo**: Regresión lineal entrenado con scikit-learn

---


---

## Cómo ejecutar el proyecto localmente

### 1. Clonar el repositorio

```bash
git clone https://github.com/COQUA/Cars_Prediccion.git
```

### 2. Instalar dependencias del backend (FastAPI)

```bash
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
```

### 3. Iniciar el servidor FastAPI

```bash
cd api
python -m uvicorn main:app --reload
```

### 4. Ejecutar el frontend (en otra terminal)
```bash
cd frontend
npm i
npm run dev
```

Si seguiste bien estos pasos, ya vas a poder utilizar el proyecto.

---

## Endpoints disponibles

- `POST /predict:` recibe datos del auto y devuelve el precio estimado.
- `GET /model_info:` devuelve el R² y detalles del modelo.

---

## ¿Qué puedo hacer?

1. Ingresar los datos del auto en el formulario.
2. Ver el precio estimado según los datos ingresados.
3. Consultar la presición del modelo.