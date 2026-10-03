# EscorpioApp: decisiones de producto y diseño

Este documento complementa a `constitution.md` y lo reemplaza donde haya conflicto.
Orden de prioridad ante dudas: **este documento > DESIGN.md > capturas de Stitch**.

## 1. Alcance

- Usuaria: Milagros. Uso exclusivo, un solo dispositivo Android, distribución por APK.
- Offline y local-first (SQLite). Sin cuentas, sin nube, sin reservas online.
- **Fuera de la primera versión:** fotos, gastos, recibos/PDF, horarios de atención,
  bloqueo de horarios, tratamientos por sesiones ("sesión 2 de 4"), búsqueda global,
  fichas para otras categorías, descuentos, cabinas, equipamiento, metas.
- Nombre de la usuaria: constante `PROFESSIONAL_NAME` en `src/config.ts` hasta el
  spec de Ajustes; después pasa a la tabla `settings` (valor inicial "Milagros").

## 2. Navegación

- 5 tabs inferiores, en este orden: **Agenda, Clientes, Servicios, Ganancias, Ajustes**.
- Íconos Ionicons (outline): `calendar`, `people`, `leaf`, `stats-chart`, `settings`.
- Dock flotante, **siempre centrado** (márgenes laterales iguales), con esquinas
  redondeadas. Tab activa en rosa con un punto debajo; inactivas en taupe.
- Formularios como modales o bottom sheets, nunca como tabs.

## 3. Estilo

- Paleta del DESIGN.md (sección Colors). Los elementos activos van en rosa `#E88D90`;
  el garnet de Stitch no se usa.
- Texto de botones primarios: token `on-primary`, para poder cambiarlo en un solo lugar.
- Tipografía Plus Jakarta Sans (400, 600, 700).
- Textos en voseo; "clienta/clientas" en femenino (la tab se llama "Clientes").
- Hora en 24 h ("09:30"). Montos con formato argentino ("$ 18.000").
- Avatares con iniciales. Sin lupa, campana, badges decorativos ni textos técnicos.

## 4. Modelo de datos

- **Categorías:** editables (nombre y color de una paleta pastel fija). Iniciales:
  Cosmetología, Maquillaje, Uñas y Otros.
- **Servicios:** nombre, categoría, descripción opcional (300 caracteres), duración en
  minutos, precio base y activo. Se desactivan, no se borran.
- **Clientas:** nombre, WhatsApp (guardado normalizado, ej. `5491158249912`), fecha de
  nacimiento opcional (la edad se calcula), email opcional, ocupación opcional y
  **alertas y alergias** (campo único, se muestra en rojo en el detalle, al agendar y
  al abrir la ficha).
- **Turnos:** clienta, fecha y hora de inicio, uno o más servicios, notas y estado
  (Pendiente, Completado, Cancelado). "En curso", "Actual" y "Nueva" se calculan; no
  se guardan.
- **Servicios del turno:** copia del nombre, duración y **precio final** (editable).
- **Pagos:** pertenecen a un turno. Monto, método (Efectivo, Transferencia,
  Mercado Pago, Tarjeta) y fecha. El tipo (seña, parcial, saldo) se deduce del monto.
- **Fiado:** turno completado con saldo pendiente. Fecha límite opcional, que se pide
  al marcarlo como Completado.
- **Ficha cosmetológica:** única ficha de la app. Cada guardado crea una versión nueva
  e inmutable (JSON validado con zod). "Editar" abre una versión nueva con los valores
  anteriores cargados.
- **Ajustes (`settings`):** nombre, recordatorio activo y hora, último respaldo.

## 5. Pantallas

- **Agenda:** tarjetas Turnos hoy, Completados y Est. del día (suma de los turnos de
  hoy no cancelados); tira semanal con puntos en días con turnos; lista con línea de
  tiempo; acciones Ficha, Completar y WhatsApp; botón flotante (+).
- **Agendar turno:** clienta, servicios **múltiples**, fecha, horarios fijos cada
  30 min de 08:00 a 21:00 con los superpuestos marcados como ocupados, seña opcional
  y notas.
- **Clientes:** búsqueda por nombre o teléfono; filtros Todos, una por categoría y
  Con deuda; tarjeta con contacto, última visita, alerta y acciones.
- **Detalle de la clienta:** encabezado, alerta, y dos secciones: **Fichas** (versiones
  con fecha y resumen del diagnóstico) y **Turnos** (historial con servicios y nota).
- **Formulario de clienta:** genérico (sin pre-diagnóstico). Al guardar va al detalle.
- **Ficha cosmetológica:** 5 pasos (Personal, Estilo, Salud, Cutánea, Diagnóstico) con
  stepper y botones Anterior/Siguiente. El paso 1 se completa con datos de la clienta.
  Fototipo, biotipo y motivo de consulta viven en esta ficha. Las observaciones se
  construyen desde una lista de datos.
- **Servicios:** agrupados por categoría; formulario con nombre, categoría
  (con "+ Nueva categoría"), descripción, duración, precio base y activo.
- **Ganancias:** mide lo **facturado** (turnos completados). Períodos: este mes, mes
  anterior, 3 meses, año. Incluye Por cobrar, evolución, servicios más rentables,
  cobrado por canal y transacciones recientes. Botón "Registrar cobro".
- **Registrar cobro:** se elige clienta, turno con saldo, monto (sugerido: el saldo)
  y método.
- **Ajustes:** perfil, resumen, recordatorios, categorías y copia de seguridad.

## 6. Recordatorios

Notificaciones locales a una hora configurable (ej. 06:00) con el resumen
"Hoy tenés X turnos". Se programan los próximos 14 días con el conteo calculado y se
reprograman al cambiar la agenda y al abrir la app.

## 7. Respaldo

Exportar e importar la base. Importar **reemplaza todos los datos** y exige
confirmación. El texto no promete encriptación: avisa que los datos viven solo en el
celular y sugiere exportar copias seguido (aviso tras 30 días sin respaldo).

## 8. Orden de specs

00 esqueleto ✅ · 00b nav ✅ · 01 NativeWind ✅ · 01b tipografía ✅ · 01c componentes ·
02 base de datos · 03 categorías y servicios · 04 clientes · 05 ficha cosmetológica ·
06 agenda y turnos · 07 cobros y fiado · 08 ganancias · 09 recordatorios ·
10 respaldo y ajustes · 11 pulido y APK.