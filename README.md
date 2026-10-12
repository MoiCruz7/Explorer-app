# Explorer App

Aplicación web para explorar países del mundo: buscar por nombre, filtrar por región y consultar el detalle de cada uno. Proyecto del Laboratorio 2 de Diseño Web Adaptable (versión **Vanilla TypeScript**), construido con Vite, TypeScript y Tailwind CSS v4, con diseño adaptable a mobile, tablet y desktop.

**Demo:** https://primer-parcial-git-master-trabajos-uni.vercel.app

## Requisitos

- Node.js 20.19 o superior
- pnpm
- Cuenta gratuita en [REST Countries](https://restcountries.com/sign-up) para obtener una clave de API

## Instalación y ejecución

```bash
pnpm install
```

Crea tu archivo de variables de entorno a partir de la plantilla y pega tu clave (ver la sección siguiente):

```bash
# PowerShell
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

```bash
pnpm dev        # servidor de desarrollo en http://localhost:5173
pnpm build      # compilación de producción (tsc + vite build)
pnpm preview    # sirve la compilación localmente
```

## Configuración de la API

La app usa la API v5 de REST Countries, que exige clave.

1. Crea una cuenta en https://restcountries.com/sign-up y copia tu clave en https://restcountries.com/api-keys.
2. En esa misma página, agrega a los *hostnames permitidos* de la clave el dominio desde donde corre la app, sin `https://` ni puerto. Para desarrollo local: `localhost`. Para producción, el dominio de Vercel.
3. En `.env.local` define la variable:

```
VITE_RESTCOUNTRIES_API_KEY=tu_clave
```

`.env.local` está en `.gitignore` y no se sube al repositorio. En Vercel, la variable se configura en *Settings → Environment Variables* y requiere un nuevo despliegue para tomar efecto.

## Fuente de datos

- **API:** [REST Countries v5](https://restcountries.com/docs/countries), endpoint `GET https://api.restcountries.com/countries/v5`.
- Se piden solo los campos necesarios con `response_fields`: código, nombres, bandera, región, población, capitales, idiomas y monedas.
- El plan gratuito devuelve máximo 100 países por petición, así que la lista completa se obtiene en 3 peticiones paginadas.
- Las respuestas se guardan en `sessionStorage` durante la sesión de la pestaña para no consumir la cuota mensual (1,000 peticiones en el plan gratuito).
- La respuesta se valida en tiempo de ejecución con un *type guard* antes de usarse, porque una anotación de tipo por sí sola no comprueba el JSON recibido.

## Organización de carpetas

```
explorer-app/
├── index.html              # Home: buscador y países destacados
├── .env.example            # Plantilla de variables de entorno
├── vite.config.ts          # Vite + Tailwind v4 y las 3 páginas de build
├── public/assets/flags/    # Banderas locales de los países destacados del Home
└── src/
    ├── api/                # Obtención de datos y manejo de errores de red
    │   └── countries.ts
    ├── types/              # Interfaces TypeScript
    │   └── country.ts
    ├── utils/              # Funciones reutilizables
    │   ├── debounce.ts     # Debounce genérico
    │   ├── filter.ts       # Búsqueda y filtro por región
    │   ├── format.ts       # Formateo y valores por defecto
    │   └── lookup.ts       # Enlaces y búsqueda de un país por código
    ├── render/             # Contenido visual y estados de la interfaz
    │   ├── dom.ts
    │   ├── flag.ts
    │   ├── countryCard.ts
    │   ├── countryList.ts
    │   ├── countryDetail.ts
    │   └── states.ts       # Carga (skeleton), vacío y error
    ├── pages/
    │   ├── resultados.html # Lista con búsqueda y filtro por región
    │   └── detalle.html    # Detalle del país elegido
    ├── main.ts             # Coordina carga inicial, eventos y actualización
    └── style.css           # Design tokens con @theme (Tailwind v4)
```

## Funcionalidades

- **Búsqueda** por nombre, sin distinguir mayúsculas ni acentos, con *debounce* de 300 ms.
- **Filtro por región** que actualiza de inmediato. Búsqueda y región se aplican a la vez: limpiar el texto conserva la región y elegir "Todas las regiones" conserva el texto.
- **Estados de la interfaz:** carga (skeleton), vacío (sin coincidencias) y error (falla de la petición, con botón *Reintentar*), diferenciados entre sí.
- **Tarjetas** con bandera, nombre, capital, región y población. Los datos ausentes se muestran como "No disponible" y las banderas que faltan o fallan, como "Sin bandera".
- **Detalle por país:** cada tarjeta enlaza a `detalle.html?code=XXX`.
- **Búsqueda desde el Home:** al presionar Enter se abre Resultados con el texto ya filtrado (`?q=`).
- **Diseño adaptable** (mobile, tablet, desktop), menú móvil, estados `hover`, `focus-visible` y `active`, y navegación por teclado.

Los tres países destacados del Home son estáticos y enlazan al detalle por código.

## Versión entregada (Vanilla TypeScript)

La versión del Laboratorio 2 está identificada con la etiqueta `entrega-lab-2`:

- Repositorio: https://github.com/MoiCruz7/Explorer-app

Para ejecutar exactamente esa versión:

```bash
git clone https://github.com/MoiCruz7/Explorer-app.git
cd Explorer-app
git checkout entrega-lab-2
pnpm install
```

Luego sigue la configuración de la API y ejecuta `pnpm dev`.

## Convención de commits

Los cambios nuevos usan [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:` y `docs:`.
