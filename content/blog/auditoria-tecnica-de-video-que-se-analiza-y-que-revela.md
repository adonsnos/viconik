---
title: "Auditoría técnica de vídeo: qué se analiza y qué revela"
slug: auditoria-tecnica-de-video-que-se-analiza-y-que-revela
pilar: auditoria
publico: sector
fecha: 2026-06-20
lectura: "9 min de lectura"
meta_title: "Auditoría técnica de vídeo: qué se analiza y qué revela | Viconik"
meta_desc: "La auditoría técnica de vídeo analiza códecs, espacios de color, audio LUFS y calidad VMAF. Descubre qué herramientas se usan y qué problemas detecta que el ojo no ve."
deck: "La auditoría técnica de vídeo va más allá de lo que el ojo ve. Analiza metadatos, calidad VMAF, normalización de audio LUFS y espacios de color para revelar problemas que el espectador percibe pero no puede nombrar."
excerpt: "La auditoría técnica de vídeo va más allá de lo que el ojo ve. Analiza metadatos, calidad VMAF, normalización de audio LUFS y espacios de color para revelar problemas que el espectador percibe pero no puede nombrar."
faqs:
  - pregunta: "¿Qué formato de archivo necesito facilitar para el análisis técnico?"
    respuesta: "Los archivos exportados en cualquier formato estándar (MP4, MOV, MXF). No es necesario compartir los archivos de proyecto de edición. Para el análisis de audio es preferible también la mezcla en WAV o AIFF si existe por separado del vídeo final."
  - pregunta: "¿El análisis VMAF funciona si no tengo el archivo original sin comprimir?"
    respuesta: "El VMAF en su forma estándar compara comprimido vs. original. Sin el original, se puede usar VMAF en modo 'no-reference' o aplicar el análisis de bitrate y artefactos visuales como alternativa. En auditorías donde el cliente solo tiene los exportados finales, el análisis se adapta a lo disponible y se documenta la limitación metodológica."
  - pregunta: "¿Qué pasa si el análisis revela que los archivos no son recuperables?"
    respuesta: "Se documenta en el informe con la recomendación de qué material habría que regrabar o reexportar desde el proyecto de edición original. En muchos casos los problemas detectados en el exportado se pueden corregir si el proyecto de edición está disponible, sin necesidad de regrabar."
cta_q: "¿Necesitas un análisis técnico de tus archivos audiovisuales?"
cta_btn: "Consultar auditoría técnica"
related:
  - post: vmaf-el-estandar-que-mide-objetivamente-la-calidad-tecnica-de-un-video
  - post: que-es-una-auditoria-audiovisual-y-para-que-sirve
---

Una auditoría técnica de vídeo analiza los archivos audiovisuales de una empresa —no solo cómo se ven en pantalla, sino qué contienen a nivel de metadatos, códec, espacio de color y calidad objetiva medible. Es la parte de la auditoría audiovisual que requiere acceso a los archivos originales y herramientas de análisis profesional. Revela problemas que el ojo no detecta pero que afectan directamente a la calidad percibida por el espectador.


## Qué herramientas se usan y qué miden


### FFprobe y MediaInfo — análisis de metadatos

FFprobe (parte de FFmpeg) y MediaInfo extraen todos los metadatos de un archivo de vídeo: códec de vídeo y audio, resolución, framerate, bitrate, espacio de color, profundidad de bits, perfil de códec, nivel, y decenas de parámetros adicionales. Un archivo puede verse correcto en reproducción y tener metadatos que revelan problemas: un H.264 con perfil Baseline en lugar de High pierde calidad de compresión innecesariamente; un audio mezclado a -23 LUFS suena adecuado en ordenador pero resulta muy bajo en móvil si la plataforma no normaliza automáticamente.


### VMAF — calidad visual objetiva

VMAF (Video Multi-Method Assessment Fusion) es el estándar de Netflix para medir la calidad visual de un vídeo de forma objetiva, correlacionando con la percepción humana. Compara el archivo comprimido con el original y produce una puntuación de 0 a 100. Una puntuación VMAF por encima de 93 es indistinguible del original para el ojo humano. Por debajo de 75, la degradación es visible. Permite comparar objetivamente diferentes presets de exportación y elegir el que maximiza calidad al menor bitrate.


### Análisis de audio — LUFS, picos y dinámica

El análisis de audio mide el nivel integrado en LUFS (Loudness Units relative to Full Scale), el rango dinámico y los picos de señal. Cada plataforma tiene su estándar de normalización: YouTube normaliza a -14 LUFS, Spotify a -14 LUFS, broadcast europeo a -23 LUFS. Un vídeo mezclado a -6 LUFS suena bien en el estudio pero YouTube lo bajará automáticamente, y la música de fondo que sonaba sutil en mezcla puede resultar dominante tras la normalización. Un vídeo a -30 LUFS subirá de nivel, pero si el rango dinámico no es correcto, el resultado puede tener artefactos de distorsión.


## Qué problemas detecta que el ojo no ve


### Espacio de color incorrecto

Las cámaras profesionales pueden grabar en perfiles logarítmicos (Log) o en espacios de color amplio (como S-Gamut o BT.2020). Si el material se exporta sin la conversión correcta al espacio de color de distribución (Rec.709 para contenido web estándar), el resultado en la mayoría de pantallas de consumo es un vídeo lavado, con colores incorrectos y contraste reducido. Este problema no siempre es obvio en el monitor de edición calibrado del estudio, pero sí lo es en el móvil del espectador.


### Banding y artefactos de compresión

El banding es la aparición de bandas visibles en gradientes suaves (cielos, fondos difuminados). Ocurre cuando se combina una profundidad de bits insuficiente (8 bits en lugar de 10) con un bitrate de exportación bajo. En la previsualización de edición raramente se ve; en la pantalla del cliente, en una sala de reuniones con proyector, puede ser notablemente feo.


### Desincronización de audio y vídeo (drift)

En producciones con grabación de audio independiente o con mezcla de fuentes, puede producirse una desincronización progresiva (drift) que en el primer minuto es imperceptible pero en el minuto 5 es obvia. Este problema se detecta con análisis frame a frame en puntos específicos del vídeo.


## Qué entrega el análisis técnico

El informe de análisis técnico documenta para cada pieza analizada: los parámetros técnicos completos, los problemas identificados con su causa probable, el impacto en la experiencia del espectador, la recomendación de corrección y si la corrección requiere acceso al material de rodaje original o puede aplicarse en postproducción sobre el archivo exportado.

> **// Política de acceso a archivos**
> El análisis técnico de archivos requiere que el cliente facilite los materiales exportados (no necesariamente los archivos de proyecto). Todos los archivos se usan exclusivamente para el análisis y no se almacenan una vez finalizado. Se firma acuerdo de confidencialidad si el cliente lo requiere.
