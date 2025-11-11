
# 🎭 Juego de Impostores

![Preview](src/Assets/Screenshots/preview.png)

Un divertido juego tipo **“Quién es el impostor”** hecho en **React + Vite**, donde tú y tus amigos podéis jugar localmente desde un solo dispositivo.  
Cada jugador ve su rol secreto, y el impostor debe intentar adivinar la palabra sin ser descubierto.  
Diseñado con una interfaz moderna, animaciones suaves y soporte para temas personalizados.

---

## 🕹️ Cómo jugar

1. **Agrega los jugadores**  
   Escribe los nombres y pulsa ➕ para añadirlos a la lista.  
   Mínimo 3 jugadores.

2. **Elige el modo de juego**  
   - **Personalizado:** crea tus propias palabras dentro del juego.  
   - **Por Temas:** selecciona un tema desde la carpeta `/public/temas`.

3. **Configura los impostores**  
   Selecciona cuántos impostores habrá (hasta la mitad de los jugadores).

4. **Inicia la partida**  
   Cada jugador, por turno, verá su carta secreta:
   - ✅ Jugador: ve la palabra.
   - 🎭 Impostor: no ve la palabra.

5. **¡Que comience la deducción!**  
   Hablad entre vosotros e intentad descubrir quién es el impostor antes de que adivine la palabra.

---

## 🌈 Características

- 🧩 **Dos modos de juego:** personalizado o basado en temas.  
- 🧠 **Gestión visual de jugadores y palabras** (añadir, editar o borrar fácilmente).  
- ✨ **Animaciones suaves y diseño moderno** con gradientes y tarjetas interactivas.  
- 📂 **Soporte para temas personalizados** (archivos `.txt` en `/public/temas/`).  
- 🎨 **Responsive y limpio**, ideal para móviles o escritorio.  
- ⚡️ **Construido con React + Vite** para máxima velocidad y simplicidad.

---

## 🧰 Estructura de archivos

```bash
📦 Juego_Impostores
├── public/
│   └── temas/
│       ├── index.json       # Lista de temas disponibles
│       ├── animales.txt     # Ejemplo de tema
│       └── peliculas.txt    # Ejemplo de tema
├── src/
│   ├── App.jsx              # Lógica principal del juego
│   ├── main.jsx             # Punto de entrada de React
│   └── assets/              # Recursos opcionales
├── index.html
├── package.json
└── vite.config.js
````

---

## 🧩 Añadir nuevos temas

Puedes crear tus propios temas personalizados con solo añadir un archivo `.txt` dentro de `/public/temas/`.

Por ejemplo:

```bash
/public/temas/
├── comida.txt
├── animales.txt
└── peliculas.txt
```

Cada línea del archivo debe contener una palabra o concepto:

```
Pizza
Hamburguesa
Tacos
Sushi
```

Y asegúrate de que `index.json` contenga la lista de esos archivos:

```json
{
  "temas": ["comida.txt", "animales.txt", "peliculas.txt"]
}
```

---

## 🚀 Ejecutar el proyecto localmente

1. **Instalar dependencias**

```bash
npm install
```

2. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

3. **Abrir en el navegador**

> [http://localhost:5173/](http://localhost:5173/)

---

## 🌍 Desplegar en GitHub Pages

Si quieres publicar tu juego online:

1. Instala el paquete de despliegue:

```bash
npm install gh-pages --save-dev
```

2. Añade esto a tu `package.json`:

```json
"homepage": "https://rafael99GD.github.io/Juego_Impostores",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Ejecuta:

```bash
npm run deploy
```

Y listo. Tu juego estará disponible en línea 🎉

---

## 🧠 Tecnologías utilizadas

* ⚛️ **React** — interfaz de usuario.
* 💨 **Tailwind CSS** — estilos modernos y responsive.
* ⚡ **Vite** — entorno de desarrollo ultrarrápido.
* 🎨 **Lucide React** — iconos SVG minimalistas.

---

## 👤 Autor

**By [rafael99](https://github.com/rafael99GD)**

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia **MIT**, lo que significa que puedes modificarlo y compartirlo libremente, dando crédito al autor original.

---

> *“En cada grupo hay un impostor, pero solo uno sabrá guardar bien el secreto.”*
