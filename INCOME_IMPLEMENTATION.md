# Implementación de la Sección de Ingresos (Income)

## Resumen
Se implementó la sección de Ingresos que permite registrar pagos en una hoja de cálculo de Google Sheets, con funcionalidad similar al componente PaymentForm del repositorio de referencia.

## Funcionalidades Implementadas

### 1. Tipos de Datos (types/payment.ts)
- Definición de `PaymentType` con campos: fecha, método de pago, descripción, monto, servicio y ID de cliente
- Constantes para métodos de pago y servicios disponibles

### 2. Componentes de Formulario
- **Select** (`components/form/select.tsx`): Componente dropdown para seleccionar opciones
- **TextInputField** (`components/form/text-input.tsx`): Campo de texto con validación
- **DateTimeInput** (modificado): Selector de fecha y hora mejorado con etiqueta

### 3. Gestión de Google Sheets
- **Google Sheets API** (`lib/google/sheets.ts`): Funciones para crear, obtener y escribir en hojas de cálculo
- **Configuración automática**: Creación automática de hoja de cálculo con encabezados
- **Validación**: Verificación de existencia de hoja de cálculo configurada

### 4. Formulario de Pagos
- **PaymentForm** (`components/payment/payment-form.tsx`): Formulario principal para registro de pagos
- **Hook personalizado** (`hooks/usePaymentForm.ts`): Manejo del estado del formulario con useReducer
- **Validaciones**: Campos requeridos y formato de datos

### 5. Configuración de Google Sheets

- **GoogleSheetsConfig** (`components/google-sheets-config.tsx`): Componente para configurar la hoja de cálculo
- **SpreadsheetSelector** (`components/spreadsheet-selector.tsx`): Selector para elegir hojas de cálculo existentes
- **Opciones de configuración**:
  - Crear nueva hoja de cálculo
  - Seleccionar hoja de cálculo existente
- **Almacenamiento local**: Persistencia del ID de la hoja de cálculo usando AsyncStorage
- **Gestión de errores**: Manejo de errores y mensajes informativos

### 6. Pantallas Actualizadas

- **Income** (`app/(app)/(tabs)/income.tsx`): Pantalla principal con validación de configuración
- **Settings** (`app/(app)/(tabs)/settings.tsx`): Pantalla de configuración que incluye Google Sheets y logout

### 7. Gestión de Sesión

- **LogoutButton** (`components/logout-button.tsx`): Componente para cerrar sesión
- **SessionProvider mejorado**: Función signOut completa que limpia Google Sign-in y datos locales
- **Información de usuario**: Muestra email y nombre del usuario autenticado

## Flujo de Uso

1. **Configuración inicial**: El usuario puede elegir entre:
   - Crear una nueva hoja de cálculo de Google Sheets
   - Seleccionar una hoja de cálculo existente de su Google Drive
2. **Validación**: La aplicación verifica si hay una hoja de cálculo configurada antes de permitir el registro de pagos
3. **Preparación automática**: Si se selecciona una hoja existente, se crea automáticamente la pestaña "Payments" con encabezados si no existe
4. **Registro de pagos**: Una vez configurada, el usuario puede registrar pagos que se guardan automáticamente en Google Sheets
5. **Persistencia**: El ID de la hoja de cálculo se almacena localmente para futuras sesiones

## Nuevas Funcionalidades Agregadas

### Selección de Hoja de Cálculo Existente

- **Listado automático**: Muestra todas las hojas de cálculo del Google Drive del usuario
- **Información detallada**: Muestra nombre y fecha de modificación de cada hoja
- **Configuración automática**: Crea la pestaña "Payments" y encabezados automáticamente si no existen
- **Validación de acceso**: Verifica que la hoja seleccionada sea accesible antes de configurarla

### Interfaz Mejorada

- **Flujo paso a paso**: Guía al usuario a través del proceso de configuración
- **Opciones claras**: Botones distinguibles para crear nueva vs. seleccionar existente
- **Retroalimentación visual**: Estados de carga y mensajes informativos
- **Opción de cambio**: Permite resetear y cambiar la configuración en cualquier momento
- **Información de cuenta**: Muestra datos del usuario y opción de logout seguro

## Validaciones Implementadas

- **Autenticación**: Verificación de sesión activa de Google
- **Configuración**: Validación de hoja de cálculo configurada
- **Formulario**: Validación de campos requeridos (descripción, monto > 0)
- **Errores**: Manejo de errores con toasts informativos
- **Logout seguro**: Confirmación antes de cerrar sesión y limpieza completa de datos

## Gestión de Sesión y Logout

### Funcionalidad de Logout

- **Confirmación de seguridad**: Alerta de confirmación antes de cerrar sesión
- **Logout completo**: Cierra sesión en Google y limpia datos locales
- **Limpieza de datos**: Elimina configuración de hojas de cálculo almacenada
- **Información de usuario**: Muestra email y nombre del usuario autenticado
- **Retroalimentación**: Mensajes de confirmación y manejo de errores

### Componente LogoutButton

El componente `LogoutButton` proporciona:

- **Información de cuenta**: Muestra email y nombre del usuario
- **Botón de logout**: Con estilo distintivo (rojo) para acción destructiva
- **Diálogo de confirmación**: Previene logout accidental
- **Manejo de errores**: Feedback en caso de problemas durante el logout
- **Estado condicional**: Solo se muestra si hay una sesión activa

## Dependencias Utilizadas

- `@react-native-picker/picker`: Para componentes dropdown
- `@react-native-async-storage/async-storage`: Para almacenamiento local
- Google Sheets API v4: Para interactuar con hojas de cálculo
- React Native Toast Message: Para notificaciones

## Notas Técnicas

- Se utiliza el patrón useReducer para el manejo del estado del formulario
- Los datos se almacenan en Google Sheets con formato tabular
- La configuración de la hoja de cálculo se persiste localmente
- Se incluye manejo de errores robusto y mensajes de retroalimentación al usuario
