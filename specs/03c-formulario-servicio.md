# Spec 03c: Formulario de servicio (crear y editar)

## Objetivo
Pantalla modal para crear y editar servicios, con validación en español y creación
de categoría en línea. Conectarla con la lista de Servicios.

## Fuera de alcance
Administrar categorías existentes (renombrar, recolorear, desactivar): spec 03d.

## Pasos (hacer a mano)
1. `npm install react-hook-form @hookform/resolvers`
2. En `app/_layout.tsx`, dentro del Stack raíz, registrar la pantalla modal:
   <Stack.Screen name="servicio-form" options={{ presentation: 'modal', headerShown: false }} />

## Pasos (openCode, UN archivo por vez)
3. `src/forms/serviceForm.ts`
   Valores del formulario: categoryId (number | null), name, description, duration (string),
   price (string), isActive (boolean).
   Esquema zod, con estos mensajes exactos:
   - categoryId null: 'Elegí una categoría'
   - name: trim, mínimo 1 'Ingresá un nombre', máximo 60 'Máximo 60 caracteres'
   - description: máximo 300 'Máximo 300 caracteres' (puede estar vacía)
   - duration: solo dígitos ('Ingresá la duración en minutos') y entre 5 y 480
     ('La duración debe ser de 5 a 480 minutos')
   - price: solo dígitos ('Ingresá el precio') y máximo 9999999 ('El precio es demasiado alto')
   Exportar también: serviceFormDefaults y toServiceInput(values), que convierte duration y
   price a número y devuelve { categoryId, name, description, durationMin, basePrice }.
4. `src/components/services/InlineCategoryCreator.tsx`
   Props: onCreated(id: number), onCancel().
   Dentro de un Card: TextField "Nombre de la categoría"; una fila con los 6 colores de COLOR_KEYS
   como círculos de 36 px (fondo categoryBg[key]); el elegido lleva borde 2 px 'border-ink' y
   un ícono 'checkmark'. Botones: Button outline sm "Cancelar" y Button primary sm "Crear categoría".
   Al crear llama a createCategory; si lanza error, lo muestra en el TextField (prop error).
   Color inicial: 'sage'.
5. `app/servicio-form.tsx`
   - Parámetros con useLocalSearchParams: id? (editar) y categoryId? (preseleccionar al crear).
   - Cabecera propia: botón ícono 'close' a la izquierda y título "Nuevo servicio" / "Editar servicio".
   - useForm con zodResolver y Controller para cada campo; ScrollView con
     keyboardShouldPersistTaps="handled" y paddingBottom generoso.
   - Cargar categorías activas con listCategories(db). Si hay id, cargar el servicio con
     getService y hacer reset() con sus valores (duration y price como texto).
     Si la categoría del servicio está inactiva, categoryId queda en null y se muestra el
     texto de ayuda "La categoría anterior está inactiva. Elegí otra."
   - Campos, en este orden:
       a. Nombre del servicio (TextField, obligatorio).
       b. Categoría: fila de FilterChip (una por categoría activa, selección única) más un chip
          final "+ Nueva categoría" que muestra/oculta el InlineCategoryCreator. Al crearse una,
          recargar categorías, seleccionarla y ocultar el creador. Mostrar el error de categoryId
          debajo de la fila.
       c. Descripción (TextField multiline, opcional, ayuda: "Se muestra al elegir el servicio en un turno").
       d. Duración en minutos: TextField con teclado numérico (solo dígitos: onChangeText hace
          replace(/\D/g, '')) y debajo FilterChip de atajo 15, 30, 45, 60 y 90 que cargan el valor
          (activo cuando el valor coincide). Mostrar debajo el formato de formatDuration cuando es válido.
       e. Precio base (ARS): TextField numérico, solo dígitos; como ayuda, formatARS(valor) en vivo.
       f. "Servicio activo": Card con Switch (mismo estilo que en la lista).
   - Pie: Button outline "Cancelar" y Button primary "Guardar servicio".
     Cancelar con cambios sin guardar (formState.isDirty) pregunta con Alert "¿Descartar cambios?"
     (botones "Seguir editando" y "Descartar").
   - Guardar: handleSubmit; con id llama a updateService y setServiceActive según el switch;
     sin id llama a createService (y setServiceActive(false) si el switch quedó apagado).
     Si lanza error, Alert.alert('Error', mensaje). Éxito: router.back().
6. En `app/(tabs)/servicios.tsx`, reemplazar los avisos de "Próximamente":
   - "Nuevo servicio" y "Crear primer servicio": router.push('/servicio-form').
   - "Crear servicio" del estado vacío con filtro: router.push con params { categoryId } de la categoría elegida.
   - "Editar" de cada tarjeta: router.push con params { id }.

## Criterios de aceptación
- "Nuevo servicio" abre el formulario como modal. Guardar vacío muestra los errores en español
  (nombre, categoría, duración, precio) sin cerrar la pantalla.
- Los atajos de duración cargan el valor y se resaltan; escribir otro valor los des-resalta.
- Bajo el precio se ve el formato en vivo, por ejemplo "$ 18.000".
- Crear un servicio válido vuelve a la lista y aparece en su categoría, con precio y duración correctos.
- "+ Nueva categoría" abre el cuadro en línea: crear "Pestañas" con un color la deja seleccionada
  en el formulario, y después aparece como chip de filtro en la lista. Crear "pestanas" muestra
  el error 'Ya existe una categoría con ese nombre'.
- "Editar" abre el formulario con los datos cargados; cambiar el precio y guardar actualiza la lista.
  Apagar "Servicio activo" y guardar deja el servicio atenuado en la lista.
- Cancelar con cambios pide confirmación; sin cambios cierra directo.
- Desde un filtro de categoría, "Crear servicio" abre el formulario con esa categoría ya elegida.
- `npx tsc --noEmit` sin errores.

## Comandos de verificación
- `npx tsc --noEmit`
- `npx expo start -c`