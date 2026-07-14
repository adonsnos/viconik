---
title: "FFmpeg para equipos de comunicación: los comandos que resuelven el 80% de los problemas"
slug: ffmpeg-comandos-produccion-audiovisual-corporativa
pilar: tecnica
publico: sector
fecha: 2026-06-09
lectura: "10 min de lectura"
meta_title: "FFmpeg para equipos de comunicación: comandos esenciales | Viconik"
meta_desc: "FFmpeg es gratuito y resuelve en segundos problemas que de otra forma requieren software de pago o esperar a la productora. Los comandos más útiles para producción corporativa."
deck: "FFmpeg es la navaja suiza del vídeo: gratuita, universal, y capaz de resolver en una línea de terminal lo que de otra forma requeriría software de pago o devolver el archivo a la productora. Estos son los comandos que más se usan en producción corporativa."
excerpt: "FFmpeg es la navaja suiza del vídeo: gratuita, universal, y capaz de resolver en una línea de terminal lo que de otra forma requeriría software de pago o devolver el archivo a la productora. Estos son los comandos que más se usan en producción corporativa."
faqs:
  - pregunta: "¿FFmpeg puede dañar archivos originales?"
    respuesta: "FFmpeg nunca modifica el archivo de entrada: siempre escribe en un archivo de salida nuevo. Mientras no se sobreescriba el original por error de nomenclatura, el riesgo es cero. Es buena práctica trabajar siempre con copias y nunca usar el mismo nombre para entrada y salida."
  - pregunta: "¿Existe una interfaz gráfica para FFmpeg?"
    respuesta: "Handbrake es la interfaz gráfica más conocida que usa FFmpeg internamente. Para las operaciones más frecuentes (conversión de formato, cambio de bitrate) es suficiente. Para operaciones avanzadas como la normalización de audio en dos pasadas o el análisis VMAF, la línea de comandos es necesaria."
  - pregunta: "¿FFmpeg es legal para uso comercial?"
    respuesta: "Sí. FFmpeg es software libre bajo licencia LGPL/GPL. El uso comercial está permitido. Los códecs que usa (H.264, H.265, AAC) pueden tener royalties asociados según el país y el volumen de distribución, pero para uso interno y distribución online estándar, no hay implicaciones prácticas de licencia para la mayoría de empresas."
cta_q: "¿Quieres que integremos FFmpeg en el proceso de QA técnico de tu producción?"
cta_btn: "Consultar auditoría técnica"
related:
  - post: normalizacion-audio-lufs-video-corporativo
  - post: vmaf-el-estandar-que-mide-objetivamente-la-calidad-tecnica-de-un-video
---

FFmpeg es una herramienta de línea de comandos gratuita y de código abierto para procesar archivos de audio y vídeo. Convierte formatos, extrae audio, recorta vídeos, normaliza audio, analiza metadatos y decenas de operaciones más, sin interfaz gráfica y sin coste. Está disponible para Windows, macOS y Linux.

No requiere formación avanzada para los usos más frecuentes. Los comandos de uso cotidiano en producción corporativa son media docena, y siguen siempre la misma estructura: `ffmpeg -i entrada.mp4 [opciones] salida.mp4`.


## Verificar los metadatos de un archivo

El primer comando que usar con cualquier archivo recibido de una productora:

`ffprobe -v error -show_streams -select_streams v:0 -of default=noprint_wrappers=1 archivo.mp4`

Muestra códec, resolución, framerate, bitrate, espacio de color, duración y todos los parámetros técnicos del stream de vídeo. En segundos sabes si el archivo cumple las especificaciones del brief.


## Convertir formato sin recomprimir (stream copy)

Para cambiar el contenedor de un archivo (por ejemplo de MOV a MP4) sin recomprimir el vídeo, manteniendo calidad idéntica:

`ffmpeg -i entrada.mov -c copy salida.mp4`

La opción `-c copy` copia todos los streams sin recodificar. Es instantáneo y no hay pérdida de calidad. Útil cuando una plataforma no acepta MOV pero el vídeo está correcto.


## Recortar un vídeo sin recomprimir

`ffmpeg -ss 00:01:30 -to 00:03:45 -i entrada.mp4 -c copy recorte.mp4`

Extrae el segmento entre 1:30 y 3:45. Con `-c copy` es instantáneo. Nota: el corte puede no ser exactamente en el frame indicado sino en el keyframe más cercano; para corte frame-exact, eliminar `-c copy` y especificar el códec de destino.


## Normalizar el audio a -14 LUFS

El filtro loudnorm de FFmpeg normaliza el audio al estándar de distribución online en dos pasadas:

Primera pasada (análisis):

`ffmpeg -i entrada.mp4 -af loudnorm=print_format=json -f null -`

Segunda pasada (corrección con los valores del análisis):

`ffmpeg -i entrada.mp4 -af loudnorm=I=-14:TP=-1:LRA=11:measured_I=[valor]:measured_TP=[valor]:measured_LRA=[valor]:measured_thresh=[valor]:offset=[valor]:linear=true -ar 48000 salida.mp4`

Los valores entre corchetes se obtienen del output JSON de la primera pasada. El resultado es un archivo con audio normalizado a -14 LUFS integrado y true peak de -1 dBTP.


## Extraer audio de un vídeo

`ffmpeg -i entrada.mp4 -vn -acodec copy audio.aac`

Extrae el stream de audio sin recomprimir. Para extraer como WAV (sin compresión):

`ffmpeg -i entrada.mp4 -vn -acodec pcm_s16le audio.wav`


## Reducir el peso de un archivo para envío

Para reducir un archivo manteniendo calidad aceptable para revisión (no para distribución final):

`ffmpeg -i entrada.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k revision.mp4`

CRF 23 es el valor por defecto de libx264 (escala de 0 a 51, menor = mejor calidad). CRF 18–23 para calidad alta, 23–28 para revisión.


## Medir la calidad VMAF de un archivo

`ffmpeg -i comprimido.mp4 -i original.mp4 -lavfi libvmaf="model=path=/usr/share/model/vmaf_v0.6.1.json" -f null -`

Produce la puntuación VMAF comparando el archivo comprimido con el original. Requiere que libvmaf esté compilado en la versión de FFmpeg instalada (las versiones de brew en macOS y los builds de ffmpeg.org en Windows lo incluyen).

> **// Dónde instalar FFmpeg**
> macOS: `brew install ffmpeg` (requiere Homebrew). Windows: descargar el build de ffmpeg.org y añadir al PATH del sistema. Linux: disponible en los repositorios de todas las distribuciones principales. Una vez instalado, todos los comandos anteriores funcionan sin configuración adicional.
