---
title: "Normalización de audio LUFS: por qué tu vídeo suena diferente en cada plataforma"
slug: normalizacion-audio-lufs-video-plataformas
pilar: tecnica
publico: sector
fecha: 2026-06-12
lectura: "8 min de lectura"
meta_title: "Normalización de audio LUFS en vídeo corporativo | Viconik"
meta_desc: "Cada plataforma normaliza el audio a un estándar diferente. Qué es LUFS, cómo afecta a tus vídeos y qué nivel de mezcla pedir a tu productora para que suene bien en todas partes."
deck: "Tu vídeo suena perfecto en el monitor del editor y demasiado bajo en el móvil del espectador. O demasiado alto en el ordenador del cliente. El problema casi siempre es el mismo: la mezcla no está normalizada para el estándar de la plataforma de distribución."
excerpt: "Tu vídeo suena perfecto en el monitor del editor y demasiado bajo en el móvil del espectador. O demasiado alto en el ordenador del cliente. El problema casi siempre es el mismo: la mezcla no está normalizada para el estándar de la plataforma de distribución."
faqs:
  - pregunta: "¿Puedo corregir el LUFS de un vídeo ya exportado sin reacceder al proyecto de edición?"
    respuesta: "Sí, con FFmpeg. El filtro loudnorm normaliza el audio del archivo de vídeo en un solo paso sin necesidad del proyecto de edición original. La corrección es de buena calidad para ajustes de hasta ±6 dB. Para correcciones mayores es preferible volver al proyecto de edición y reexportar con la mezcla corregida."
  - pregunta: "¿La diferencia de LUFS es perceptible para el espectador medio?"
    respuesta: "Un vídeo a -6 LUFS y otro a -14 LUFS son claramente diferentes en volumen percibido: la diferencia es de 8 dB, que es aproximadamente el doble de volumen percibido. No hace falta tener oído entrenado para notarlo. Lo que el espectador no puede identificar es la causa; lo que sí percibe es que el vídeo suena demasiado alto o bajo respecto al contenido que lo rodea."
  - pregunta: "¿El LUFS afecta a vídeos sin voz, como motion graphics corporativos con solo música?"
    respuesta: "Sí, y con frecuencia de forma más problemática. La música tiene rango dinámico mayor que la voz, lo que hace más probable que la normalización de la plataforma afecte al balance de frecuencias y a la percepción del impacto emocional. Los vídeos de motion graphics con solo música deberían mezclarse con especial atención al estándar de LUFS del canal principal de distribución."
cta_q: "¿Quieres verificar si el audio de tus vídeos cumple el estándar correcto?"
cta_btn: "Solicitar análisis técnico"
related:
  - post: codecs-h264-h265-av1-cual-usar-en-produccion-corporativa
  - post: bitrate-resolucion-y-formato-de-exportacion-que-pedir-a-tu-productora
---

LUFS (Loudness Units relative to Full Scale) es la unidad de medida de volumen percibido en audio. A diferencia de los dBFS (que miden picos de señal), los LUFS miden el volumen que el oído humano percibe de forma integrada, ponderando las frecuencias según la sensibilidad del oído. Es el estándar adoptado por la EBU (R128) y por todas las plataformas de distribución de audio y vídeo para normalizar el volumen de forma consistente.

El problema práctico: si tu productora mezcla el audio del vídeo sin referencia a un estándar de LUFS concreto, el resultado sonará diferente en cada plataforma, en cada dispositivo y en cada contexto de reproducción. Y no de una forma sutil.


## Cómo normaliza cada plataforma

Las plataformas de distribución miden el loudness de cada vídeo que reciben y lo ajustan automáticamente a su estándar interno:

- **YouTube:** normaliza a -14 LUFS integrado. Un vídeo a -6 LUFS (demasiado alto) se baja 8 dB. Un vídeo a -23 LUFS (demasiado bajo) se sube 9 dB.
- **LinkedIn:** no normaliza automáticamente en todos los casos. Los vídeos se reproducen al nivel en que se subieron, lo que hace más crítico que la mezcla sea correcta desde origen.
- **Instagram / Reels:** normaliza aproximadamente a -14 LUFS, similar a YouTube.
- **Vimeo:** no normaliza. El vídeo se reproduce al nivel de la mezcla original.
- **Broadcast europeo (EBU R128):** -23 LUFS integrado.


## Qué ocurre cuando la mezcla no está normalizada

Si el vídeo está mezclado a -6 LUFS y YouTube lo baja 8 dB para alcanzar su estándar de -14 LUFS, el resultado no es simplemente un vídeo más silencioso. La normalización afecta a toda la señal de igual forma, lo que significa que los elementos que en mezcla alta estaban equilibrados pueden desequilibrarse al bajar: la voz puede resultar menos presente respecto a la música, los efectos de sonido pueden volverse demasiado prominentes, y si hay compresión aplicada de forma agresiva en mezcla alta, el resultado tras la normalización puede sonar distorsionado.

El caso contrario (mezcla demasiado baja que la plataforma sube) es también problemático: al subir una señal baja se amplifica también el ruido de fondo, el hiss de habitación y cualquier artefacto que en la mezcla original era inapreciable.


## El estándar correcto para producción corporativa

Para distribución en plataformas online (YouTube, LinkedIn, web), el target correcto es **-14 LUFS integrado** con **true peak máximo de -1 dBTP**. Esto garantiza que el vídeo llegue a YouTube y LinkedIn sin necesidad de normalización significativa, suene correcto en dispositivos móviles (que con frecuencia tienen compresores de volumen propios), y mantenga el equilibrio de la mezcla original.

Para contenido que va a distribuirse también en broadcast o en entornos corporativos con sistemas de audio de sala, es recomendable entregar dos versiones: una a -14 LUFS para online y otra a -23 LUFS para broadcast/sala.


## Cómo verificar el LUFS de un vídeo existente

Con FFmpeg, el análisis de loudness de un archivo es un comando de una línea:

`ffmpeg -i archivo.mp4 -af loudnorm=print_format=summary -f null -`

El output incluye el integrated loudness (LUFS integrado), el true peak y el loudness range. Con estas tres cifras es posible determinar si la mezcla cumple el estándar y qué corrección necesita.

> **// Lo que hay que incluir en el brief técnico**
> El brief técnico de producción debe especificar: audio mezclado a -14 LUFS integrado, true peak máximo de -1 dBTP, rango dinámico (LRA) entre 6 y 12 LU para vídeo corporativo estándar. Pedir al técnico de sonido que entregue el informe de loudnorm de FFmpeg o el análisis del medidor de la DAW como documentación de entrega.
