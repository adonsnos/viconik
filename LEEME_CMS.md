# Editor de blog tipo Blogger — puesta en marcha

Esto añade un panel en `/interno/admin/` desde el que editas los 45 posts y la portada sin tocar código. Cada vez que guardas, el sitio se reconstruye solo y queda publicado en 1–2 minutos.

**Requisito de fondo:** para que esto funcione, el sitio deja de subirse a mano (zip → Netlify) y pasa a desplegarse desde un repositorio de GitHub. Es un cambio de flujo, pero es el único camino para tener edición en caliente sin montar un backend propio. A partir de aquí, cualquier cambio en el sitio —lo hagas tú desde el panel o yo por código— se sube a GitHub y Netlify lo publica automáticamente.

---

## Puesta en marcha (una sola vez)

### 1. Crear el repositorio en GitHub

- Crea un repo nuevo (privado) en GitHub, por ejemplo `viconik-web`.
- Sube el contenido de esta carpeta tal cual está (todos los archivos, incluida `content/`, `netlify.toml`, `build.js`, `package.json`).

```bash
cd viconik-web
git init
git add .
git commit -m "Sitio inicial con CMS"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/viconik-web.git
git push -u origin main
```

### 2. Conectar el repo a Netlify

En el sitio de Netlify que ya tienes (viconik.com):

- **Site settings → Build & deploy → Link repository** (o crea un "New site from Git" si prefieres empezar limpio y luego cambiar el dominio).
- Netlify detecta automáticamente el `netlify.toml`: build command `npm install && node build.js`, publish directory `.`.
- Haz el primer deploy. Tarda algo más de lo habitual (instala dependencias de Node y genera los 45 posts).

### 3. Activar Git Gateway

- **Site settings → Identity → Enable Identity** (si no estaba ya activo, que debería estarlo porque ya protege `/interno/`).
- **Identity → Services → Git Gateway → Enable Git Gateway.**

Esto es lo que permite que el panel guarde cambios sin que cada persona necesite su propio token de GitHub.

### 4. Confirmar que tu usuario tiene acceso

Si ya usas el login de `/interno/` con tu email, no hace falta hacer nada más: el panel reutiliza esa misma sesión. Si es un usuario nuevo, invítalo desde **Identity → Invite users** con rol `admin` (igual que ya haces para acceder al resto del sitio).

---

## Uso diario

1. Ve a `https://viconik.com/interno/admin/`
2. Si no tienes sesión iniciada, te pide login (mismo sistema que el resto de `/interno/`)
3. Verás dos colecciones:
   - **Blog** — los 45 artículos, editables uno a uno o para crear nuevos
   - **Portada — destacados del blog** — los 3 artículos que aparecen en la home

### Editar un post existente
Ábrelo desde la lista, cambia lo que quieras (título, cuerpo, FAQs, CTA...), pulsa **Publish**. En 1–2 minutos el cambio está en vivo.

### Crear un post nuevo
**New Blog** → rellena los campos → **Publish**. El post aparece automáticamente en el índice del blog, con los filtros por pilar y público ya funcionando.

### Cambiar los destacados de portada
Entra en **Portada → Módulo 'Desde el blog' de la portada**, cambia los 3 artículos seleccionados, **Publish**.

### El campo "Cuerpo del artículo"
Es un editor de texto enriquecido con Markdown por debajo. Para los bloques de "criterio" con fondo gris (los que dicen `// Algo` en mayúsculas pequeñas), usa una cita con la primera línea en negrita empezando por `//`:

```
> **// Lo que no es una auditoría audiovisual**
> El texto del bloque va aquí.
```

El sistema lo detecta y lo convierte automáticamente en el recuadro con el estilo correcto.

---

## Qué pasa con los cambios que yo (Claude) haga en el futuro

Si en una conversación te preparo cambios de código, te los entrego igual que hasta ahora (archivos o zip). La diferencia es que ahora, en lugar de subirlos a Netlify a mano, los subes a GitHub (`git add . && git commit -m "..." && git push`) y Netlify los despliega solo. Si prefieres, dímelo en el momento y te dejo también el comando exacto según lo que haya cambiado.

**Importante:** no vuelvas a subir zips a mano al dashboard de Netlify una vez conectado el repo — el próximo deploy automático desde GitHub sobrescribiría cualquier cambio manual que no esté en el repositorio.
