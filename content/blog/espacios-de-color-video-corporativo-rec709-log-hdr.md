---
title: "Espacios de color en vídeo corporativo: Rec.709, Log y HDR explicados"
slug: espacios-de-color-video-corporativo-rec709-log-hdr
pilar: tecnica
publico: sector
fecha: 2026-06-11
lectura: "9 min de lectura"
meta_title: "Espacios de color en vídeo corporativo: Rec.709, Log y HDR | Viconik"
meta_desc: "Rec.709, Log y HDR no son filtros ni estilos: son decisiones técnicas que afectan a cómo se ve tu vídeo en la pantalla del espectador. Qué son, cuándo usarlos y qué pedir a tu productora."
deck: "Un vídeo que se ve perfecto en el monitor del editor puede verse lavado y sin contraste en la pantalla del cliente. La causa más frecuente es un problema de espacio de color que no se corrigió en postproducción. Esto es lo que necesitas saber."
excerpt: "Un vídeo que se ve perfecto en el monitor del editor puede verse lavado y sin contraste en la pantalla del cliente. La causa más frecuente es un problema de espacio de color que no se corrigió en postproducción. Esto es lo que necesitas saber."
faqs:
  - pregunta: "¿Toda la producción corporativa debería grabarse en Log?"
    respuesta: "No necesariamente. Grabar en Log tiene sentido cuando se necesita máximo rango dinámico para la corrección de color (exteriores con alto contraste, escenas con muchas fuentes de luz simultáneas). Para producción controlada en estudio con iluminación constante, grabar en el perfil de color estándar de la cámara (Rec.709 o similar) simplifica el flujo de trabajo sin penalización de calidad significativa."
  - pregunta: "¿Cómo detecto si un vídeo tiene un problema de espacio de color sin herramientas técnicas?"
    respuesta: "El síntoma más claro es un aspecto lavado y sin contraste en tonos medios, con altas luces que no tienen el brillo esperado. Si el vídeo fue grabado en Log sin conversión correcta, el cielo parece gris en lugar de azul, las pieles tienen tono grisáceo y las sombras carecen de profundidad. En contraste, un vídeo con perfil de color demasiado saturado (como sRGB interpretado como Rec.709) muestra colores sobre-intensos con rojos y verdes especialmente exagerados."
  - pregunta: "¿El espacio de color afecta al archivo que YouTube sirve al espectador?"
    respuesta: "YouTube interpreta y recomprime todos los vídeos subidos. Si el vídeo está mal etiquetado en espacio de color, YouTube puede interpretarlo incorrectamente en la recompresión, produciendo un resultado diferente al deseado. YouTube recomienda explícitamente subir en Rec.709 para contenido SDR estándar y especifica los metadatos correctos para HDR10 y HLG en su documentación técnica."
cta_q: "¿Quieres verificar si tus vídeos tienen el espacio de color correcto?"
cta_btn: "Solicitar análisis técnico"
related:
  - post: codecs-h264-h265-av1-cual-usar-en-produccion-corporativa
  - post: auditoria-tecnica-de-video-que-se-analiza-y-que-revela
---

Un espacio de color define el rango de colores y la curva de luminosidad que un sistema de vídeo puede representar. Diferentes espacios de color tienen diferentes gamuts (rangos de color), diferentes curvas de transferencia y diferentes usos. La confusión entre ellos produce vídeos que se ven incorrectos en la pantalla del espectador, aunque se hayan visto perfectos en el monitor del editor.


## Rec.709 — el estándar de distribución

Rec.709 (también escrito BT.709) es el estándar de espacio de color para vídeo HD de distribución: web, broadcast, streaming. Cuando subes un vídeo a YouTube o LinkedIn, la plataforma asume que está en Rec.709. Cuando un navegador reproduce un vídeo en una pantalla convencional, lo interpreta como Rec.709.

Si el vídeo no está en Rec.709 o no está correctamente etiquetado como tal, el navegador o la plataforma lo interpretarán igualmente como Rec.709 aunque no lo sea, produciendo colores incorrectos: lavados si el original era Log, sobre-saturados en ciertas frecuencias si era S-Gamut, o con el contraste incorrecto si era HLG sin conversión.


## Log — grabación, no distribución

Los perfiles Log (S-Log2, S-Log3 de Sony; Log-C3, Log-C4 de Arri; V-Log de Panasonic; Canon Log de Canon) son curvas de gamma que las cámaras profesionales usan para capturar el máximo rango dinámico posible. Comprimen las altas luces y las sombras en un espacio tonal más estrecho para que quepan más pasos de diafragma en el sensor.

Un vídeo grabado en Log se ve grisáceo, sin contraste y con colores apagados directamente de la cámara. Eso es correcto: no es un error. El material Log necesita una corrección de color (un LUT técnico o un grade manual) que lo convierta a Rec.709 antes de exportar para distribución. Si este paso se omite, el resultado es un vídeo entregado al cliente con aspecto de "sin terminar" que en pantallas convencionales se ve lavado y con mal contraste.


## HDR — rango dinámico extendido

HDR (High Dynamic Range) no es un filtro ni un efecto: es un estándar de distribución para pantallas capaces de mostrar más brillo y más contraste que un monitor estándar. Los estándares principales son HDR10 (el más extendido, con metadatos estáticos), Dolby Vision (metadatos dinámicos por escena) y HLG (Hybrid Log-Gamma, diseñado para broadcast).

Para producción corporativa estándar, HDR solo tiene sentido si el contenido va a distribuirse en plataformas que lo soportan (YouTube HDR, Apple TV+) y si se ve en televisores o monitores HDR. Para la mayoría del vídeo corporativo B2B que se ve en ordenadores, móviles y proyectores de sala, HDR no añade valor y puede crear problemas de compatibilidad si no se implementa correctamente.


## El problema más frecuente: Log sin convertir

La situación más común que detecta una auditoría técnica: productoras que graban en S-Log3 (correcto para maximizar el rango dinámico) pero exportan sin aplicar la corrección de color completa, entregando un archivo que en Premiere o Final Cut se ve correcto en el timeline (porque el software compensa el Log en previsualización) pero que exportado a MP4 para distribución tiene el perfil Log visible.

El espectador percibe esto como un vídeo "apagado" o "de mala calidad", sin poder identificar la causa técnica. La solución es aplicar el LUT técnico de conversión Log→Rec.709 antes del grade creativo y verificar que el export tiene el flag de espacio de color correcto.

> **// Cómo verificarlo con FFprobe**
> El comando `ffprobe -v error -show_streams -select_streams v:0 archivo.mp4` muestra entre otros parámetros `color_space`, `color_transfer` y `color_primaries`. Un vídeo correctamente exportado en Rec.709 debe mostrar `bt709` en los tres campos. Si alguno muestra `unknown` o un perfil Log, hay un problema de etiquetado que puede causar interpretación incorrecta en algunos reproductores.
