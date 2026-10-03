## Contexto del Proyecto

### Visión General
Desarrollo de una aplicación móvil nativa exclusiva para una profesional de la estética y belleza integral. El objetivo es centralizar la gestión operativa de sus múltiples emprendimientos y servicios (Cosmetología, Maquillaje, Uñas y otros) en un único lugar. La app incluye una agenda unificada de turnos, gestión de clientes y fichas/planillas técnicas personalizadas según el tipo de servicio contratado.

### Tipo de Despliegue y Arquitectura
- **Uso Exclusivo Monousuario:** Aplicación de uso personal sin autenticación multi-inquilino ni infraestructura en la nube.
- **Distribución:** Entrega mediante ejecutable directo de Android (`.apk`).
- **Persistencia de Datos:** Local-First utilizando **SQLite** (`expo-sqlite`). Todos los datos de clientes, servicios, agenda y fichas técnicas residen 100% en el dispositivo del usuario.
- **Respaldo:** Mecanismo de exportación e importación de la base de datos (copia de seguridad en JSON o archivo `.db`) para prevenir pérdidas de información al cambiar de dispositivo.

### Stack Tecnológico
- **Framework Mobile:** React Native con Expo (TypeScript).
- **Base de Datos Local:** `expo-sqlite` (con esquemas estrictos y migraciones).
- **Estilos & Design System:** NativeWind (Tailwind CSS) con configuración de paleta pastel personalizada.
- **Manejo de Formularios & Validación:** `react-hook-form` + `zod`.

### Guía de Estilo e Interfaz (UI/UX)
- **Concepto:** Estética minimalista, limpia, femenina, elegante y profesional.
- **Paleta de Colores:** Predominio de tonos suaves y agradables a la vista.
  - *Fondos:* Blancos cálidos y tonos hueso (`#FAF5F5`).
  - *Acentos / Primarios:* Rosas suaves (`#E88D90`), salmón claro y melocotón pastel.
  - *Diferenciadores de Área:* Identificadores de color sutiles o badges pastel para categorizar rápidamente los servicios (p. ej. Rosa para Cosmetología, Salmón para Maquillaje, Durazno para Uñas).
  - *Tipografía:* Contrastes suaves utilizando grises cálidos o marrones oscuros (`#4A3E3D`).

### Dominios Principales del Sistema
1. **Directorio Multiservicio de Clientes:** Ficha central del cliente con datos de contacto, historial general de turnos y saldo/gastos acumulados.
2. **Planillas Técnicas Especializadas (Fichas):** 
   - Módulo de fichas adaptables según la categoría del servicio:
     - *Ficha Cosmetológica:* Tipo de piel, alergias, biotipo, antecedentes, rutina en casa.
     - *Ficha de Uñas:* Tipo de lámina ungueal, alergias a polímeros/geles, técnica preferida, historial de retoques.
     - *Ficha de Maquillaje:* Tipo de evento, tono/subtono de piel, sensibilidad ocular, preferencias de estilo.
     - *Ficha General/Otros:* Notas de consulta estándar.
3. **Catálogo de Servicios & Precios:** Configuración de servicios ofrecidos agrupados por emprendimiento/categoría, indicando duración estimada y precio base.
4. **Agenda Unificada:** Control de citas por fecha y hora, asignando cliente, emprendimiento/servicio, precio final y estado del turno (Pendiente, Completado, Cancelado).

## Decisiones de Producto (v2)

- **Navegación:** tabs inferiores (Agenda, Clientes, Servicios, Ajustes) con Expo Router.
- **Fichas técnicas:** versionadas; cada edición genera una versión nueva e inmutable. Se puede consultar el historial por cliente y categoría.
- **Turnos:** un turno puede incluir múltiples servicios de distintas categorías.
- **Pagos:** señas, pagos parciales y servicios fiados (saldo pendiente con fecha límite opcional).
- **Sin fotos:** la app no almacena imágenes; el respaldo es solo JSON o `.db`.
- **Recordatorios:** notificaciones locales a hora configurable (p. ej. 06:00) con el resumen de turnos del día, reprogramadas ante cada cambio de agenda.
- **Distribución:** solo APK (build EAS preview), sin Play Store.