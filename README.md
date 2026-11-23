# El Bombillo — diseño V2 corregido

Base: Diseño integral de El Bombillo (1).zip. La carpeta elbombillo-redesign corresponde a la versión anterior y no contiene estos cambios.

## Ejecutar

Desde esta carpeta:

```powershell
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Vista previa: http://127.0.0.1:5173/

## Archivos modificados

- src/App.tsx: menú y galería como diálogos nativos, foco, cierre, filtros, calendario y navegación.
- src/refinements.css: ajustes visuales, menú responsive, movimiento y calendario móvil.
- src/main.tsx: carga de los estilos adicionales.

## Validación realizada

- TypeScript: npx tsc --noEmit, sin errores.
- Compilación: npm run build, correcta.
- Navegación desde Explorar y cierre con Escape.
- Foco dentro del diálogo y retorno al cerrar.
- Escritorio 1440 × 900 y móvil 390 × 844.
- Filtro de Homeschooling enlaza al programa correcto.
- Cambio de grupos, filtro de módulo, calendario y solicitud simulada hasta su resumen.
- Apertura y cierre de galería.
- Consola del navegador sin errores en la revisión final.

## Alcance de la demo

React + TypeScript, tal como se exportó de Figma. Fotografías y programación de ejemplo. Octubre de 2025 se conserva como mes de demostración, no como agenda vigente.

No hay backend, MySQL, autenticación real ni envío de formularios. El panel administrativo es una maqueta interactiva: no guarda ni publica cambios. Los mensajes de guardado se han aclarado para reflejar esta limitación.

Las preferencias de movimiento reducido desactivan animaciones mediante CSS. No se ha realizado una auditoría exhaustiva de accesibilidad.

Capturas: output/portada.jpg y output/explorar.jpg.
