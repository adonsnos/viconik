---
title: "Bitrate, resolución y formato de exportación: qué pedir a tu productora"
slug: bitrate-resolucion-y-formato-de-exportacion-que-pedir-a-tu-productora
pilar: tecnica
publico: ambos
fecha: 2026-06-07
lectura: "8 min de lectura"
meta_title: "Bitrate, resolución y formato de exportación para vídeo corporativo | Viconik"
meta_desc: "Sin especificaciones técnicas claras en el brief, tu productora entregará lo que considera estándar, que puede no serlo para tus canales. Las especificaciones exactas que debes incluir."
deck: "Si el brief de producción no especifica el bitrate, la resolución y el formato de exportación, la productora entregará lo que considera adecuado. Que puede no coincidir con lo que necesitas para cada canal. Aquí están las especificaciones exactas."
excerpt: "Si el brief de producción no especifica el bitrate, la resolución y el formato de exportación, la productora entregará lo que considera adecuado. Que puede no coincidir con lo que necesitas para cada canal. Aquí están las especificaciones exactas."
faqs:
  - pregunta: "¿Debería pedir siempre el archivo master aunque no lo vaya a usar inmediatamente?"
    respuesta: "Sí. El master es el seguro de vida del proyecto: si en dos años necesitas una versión diferente, cortada o adaptada a un nuevo formato, el master permite hacerlo con calidad completa sin volver a la productora. El coste de almacenamiento es mínimo comparado con tener que regrabar o reeditar desde cero."
  - pregunta: "¿Cómo verifico que el archivo entregado cumple las especificaciones?"
    respuesta: "Con MediaInfo (gratuito, interfaz gráfica) o con FFprobe. Ambas herramientas muestran en segundos todos los parámetros técnicos del archivo: códec, bitrate, resolución, framerate, espacio de color y parámetros de audio. No es necesario reproducirlo para verificar que es correcto técnicamente."
  - pregunta: "¿El peso del archivo afecta a la calidad en YouTube?"
    respuesta: "No directamente: YouTube recomprime todos los vídeos independientemente de su peso. Lo que afecta a la calidad final en YouTube es el bitrate y la calidad del archivo subido. YouTube recomienda subir con el bitrate más alto posible para que su recompresión parta del mejor original. Un archivo de 10 GB en ProRes subido a YouTube producirá mejor resultado que uno de 500 MB en H.264 de baja calidad."
cta_q: "¿Quieres que revisemos las especificaciones técnicas de tu pipeline de producción?"
cta_btn: "Solicitar auditoría técnica"
related:
  - post: codecs-h264-h265-av1-cual-usar-en-produccion-corporativa
  - post: normalizacion-audio-lufs-video-corporativo
---

La entrega técnica de un vídeo corporativo tiene implicaciones directas en cómo se ve en cada canal de distribución. Un archivo entregado sin especificaciones claras puede verse correcto en el ordenador del editor y degradado en el móvil del espectador, tener un peso que impide subirlo a la plataforma, o perder calidad al ser recomprimido por YouTube porque el original no tenía suficiente bitrate.

Incluir las especificaciones técnicas en el brief es tan importante como incluir el mensaje o el tono. Sin ellas, cada productora entrega según su estándar propio.


## Especificaciones por canal de distribución


### YouTube (vídeo principal de canal)

- Resolución: 1920×1080 mínimo (3840×2160 para contenido 4K)
- Códec: H.264 perfil High, nivel 4.1 (o H.265 para 4K)
- Bitrate vídeo: 8–12 Mbps para 1080p, 35–45 Mbps para 4K
- Framerate: 25fps (Europa) o el framerate de rodaje sin conversión
- Audio: AAC estéreo, 320 kbps, normalizado a -14 LUFS
- Contenedor: MP4
- Espacio de color: Rec.709


### LinkedIn (vídeo nativo)

- Resolución: 1920×1080 (horizontal) o 1080×1920 (vertical para móvil)
- Duración máxima: 10 minutos (optimal: 30–90 segundos para feed)
- Peso máximo: 5 GB
- Códec: H.264, mismo perfil que YouTube
- Audio: AAC estéreo, 320 kbps, -14 LUFS
- Subtítulos: SRT separado recomendado (LinkedIn reproduce sin sonido por defecto)


### Web embebido (Vimeo como hosting)

- Resolución: 1920×1080 mínimo
- Bitrate: 10–15 Mbps para que Vimeo genere todas las variantes de calidad correctamente
- Códec: H.264 High o H.265
- Audio: AAC estéreo, 320 kbps, -14 LUFS
- Contenedor: MP4


### Archivo master de preservación

- Códec: ProRes 422 HQ (macOS/DaVinci) o DNxHD 185 (Windows/Avid)
- Resolución: la máxima del material de rodaje
- Audio: PCM sin compresión, 48 kHz, 24 bits
- Contenedor: MOV o MXF


## Por qué el bitrate importa más que la resolución

Una resolución 4K con bitrate de 4 Mbps se ve peor que una resolución 1080p con 10 Mbps. El bitrate determina cuánta información se conserva en cada fotograma: con bitrate bajo, el códec descarta detalles y produce artefactos (macroblocking, banding, mosquito noise). La resolución solo es útil si el bitrate es suficiente para sostenerla.

La recomendación práctica: para producción corporativa estándar en 1080p, exigir un mínimo de 8 Mbps en bitrate variable (VBR) con pico de 12 Mbps. Para contenido con mucho movimiento (eventos, deportes, cámaras en mano) subir a 12 Mbps mínimo.


## El archivo master: por qué siempre pedirlo

El archivo master es el vídeo sin comprimir o con compresión mínima (ProRes, DNxHD) del que se derivan todas las exportaciones. Pedir el master en cada proyecto permite reeditar en el futuro sin acceder a los archivos de proyecto de edición, crear versiones para nuevos canales con la máxima calidad de partida, y no depender de la productora si necesitas una versión diferente años después.

> **// El brief técnico mínimo**
> Añade al final de cualquier brief de producción un bloque con estas especificaciones: "Entrega: MP4 H.264 High, 1920×1080, 10 Mbps VBR, audio AAC 320 kbps a -14 LUFS, espacio de color Rec.709. Archivo master adicional en ProRes 422 HQ o DNxHD 185." Una sola línea que elimina la ambigüedad técnica de la entrega.
