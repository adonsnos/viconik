---
title: "VMAF: el estándar que mide objetivamente la calidad técnica de un vídeo"
slug: vmaf-el-estandar-que-mide-objetivamente-la-calidad-tecnica-de-un-video
pilar: auditoria
publico: sector
fecha: 2026-06-15
lectura: "9 min de lectura"
meta_title: "VMAF: el estándar de calidad objetiva de vídeo explicado | Viconik"
meta_desc: "VMAF es el estándar de Netflix para medir calidad visual de vídeo correlacionando con percepción humana. Cómo funciona, qué dice la puntuación y para qué sirve en producción corporativa."
deck: "VMAF mide la calidad visual de un vídeo de forma objetiva correlacionando con la percepción humana. Es el estándar de Netflix, integrado en FFmpeg, y el único método fiable para comparar exportaciones sin depender del ojo."
excerpt: "VMAF mide la calidad visual de un vídeo de forma objetiva correlacionando con la percepción humana. Es el estándar de Netflix, integrado en FFmpeg, y el único método fiable para comparar exportaciones sin depender del ojo."
faqs:
  - pregunta: "¿VMAF funciona con todos los formatos de vídeo?"
    respuesta: "Sí. VMAF a través de FFmpeg acepta cualquier formato que FFmpeg pueda decodificar: MP4, MOV, MXF, AVI y prácticamente cualquier contenedor estándar con H.264, H.265, AV1, ProRes u otros códecs. El único requisito es tener tanto el archivo de referencia como el comprimido en formatos que FFmpeg pueda procesar."
  - pregunta: "¿Puedo calcular VMAF sin conocimientos técnicos avanzados?"
    respuesta: "La implementación técnica requiere familiaridad con la línea de comandos y FFmpeg. Existen interfaces gráficas como Handbrake (con soporte VMAF en versiones recientes) que facilitan el proceso. Para un uso sistemático en pipeline de producción, lo habitual es que un técnico configure el proceso y lo automatice mediante script."
  - pregunta: "¿Qué VMAF mínimo debería exigir a mi productora?"
    respuesta: "Para distribución web estándar (YouTube, LinkedIn, web), un VMAF mínimo de 85 es un umbral razonable. Para distribución en pantallas grandes o contenido de alta calidad de imagen (producto, arquitectura), 90 o superior. Estos umbrales deben especificarse en el brief técnico de producción para que la productora pueda incluirlos en su proceso de control de calidad."
cta_q: "¿Quieres que analicemos técnicamente la calidad de tus exportaciones?"
cta_btn: "Consultar auditoría técnica"
related:
  - post: auditoria-tecnica-de-video-que-se-analiza-y-que-revela
  - post: bitrate-resolucion-y-formato-de-exportacion-que-pedir-a-tu-productora
---

VMAF (Video Multi-Method Assessment Fusion) es el estándar de medición de calidad visual desarrollado por Netflix y actualmente adoptado como referencia por la industria audiovisual. A diferencia de métricas anteriores como PSNR o SSIM, VMAF correlaciona con la percepción humana: mide lo que el ojo realmente percibe, no solo la diferencia matemática entre píxeles. El resultado es una puntuación de 0 a 100 que permite comparar objetivamente la calidad de distintas exportaciones de un mismo vídeo.


## Por qué PSNR y SSIM no son suficientes

PSNR (Peak Signal-to-Noise Ratio) mide la diferencia entre el original y el comprimido en términos de ruido de señal. Es una buena métrica para ingeniería de telecomunicaciones pero correlaciona mal con la percepción humana: un vídeo con artefactos de compresión visibles puede tener PSNR alto, y un vídeo con suave degradación global puede tener PSNR bajo. El ojo humano no funciona como una función de error cuadrático medio.

SSIM (Structural Similarity Index) mejora sobre PSNR incorporando luminancia, contraste y estructura, pero sigue siendo una métrica de baja fidelidad perceptual en casos complejos (movimiento rápido, texturas complejas, fundidos). Netflix documentó públicamente en 2016 que SSIM producía predicciones incorrectas en el 30% de los casos analizados en su catálogo, lo que motivó el desarrollo de VMAF.


## Cómo funciona VMAF

VMAF combina varias métricas de características visuales (VIF — Visual Information Fidelity, ADM — Anti-noise Detail Measure, motion score) y las pondera mediante un modelo de machine learning entrenado con puntuaciones de calidad percibida obtenidas de paneles de espectadores humanos. El resultado es una puntuación que predice con alta fiabilidad cómo valorará el ojo humano la calidad del vídeo comprimido.

La implementación de referencia está integrada en FFmpeg mediante el filtro `libvmaf`. El cálculo requiere el archivo original (sin comprimir o con mínima compresión) y el archivo comprimido a evaluar.


## Qué dice la puntuación VMAF

- **VMAF > 93:** la degradación es prácticamente invisible para el ojo humano en condiciones normales de visionado.
- **VMAF 85–93:** degradación muy leve, no perceptible en la mayoría de pantallas y condiciones.
- **VMAF 75–85:** degradación leve, perceptible en pantallas grandes o en contenido con texturas complejas.
- **VMAF 60–75:** degradación visible, apreciable en cualquier pantalla de resolución media o superior.
- **VMAF < 60:** degradación significativa, inaceptable para distribución profesional.


## Para qué sirve en producción corporativa


### Optimizar los presets de exportación

Sin VMAF, la elección del bitrate de exportación se basa en convención o en ensayo y error visual. Con VMAF, es posible comparar objetivamente diferentes bitrates y elegir el que maximiza calidad a menor peso de archivo. Esto tiene implicación directa en tiempos de carga, consumo de datos de la audiencia móvil y costes de almacenamiento y CDN.


### Validar la calidad antes de publicar

Integrado en el pipeline de QA, VMAF detecta exportaciones que no alcanzan el umbral de calidad definido antes de publicar. Es especialmente útil cuando la exportación se automatiza o cuando hay varios técnicos con configuraciones de exportación distintas.


### Comparar proveedores

Si dos productoras entregan el mismo material con especificaciones distintas, VMAF permite una comparación objetiva de la calidad técnica de cada entrega, independientemente del bitrate declarado o del códec usado.

> **// VMAF en la auditoría técnica de Viconik**
> La auditoría técnica completa incluye medición VMAF cuando el cliente facilita los archivos exportados y, si es posible, los originales de referencia. Si solo están disponibles los exportados finales, el análisis se complementa con métricas de bitrate, perfil de códec y análisis visual de artefactos. La puntuación VMAF obtenida se documenta por pieza con su interpretación y recomendación de corrección si procede.
