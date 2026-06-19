# Tencent TokenHub Hy Image Lite — OpenClaw Plugin

Plugin no oficial para generar imágenes con **Hy Image Lite** a través de **TokenHub** (`tokenhub.tencentmaas.com`).

No usa el endpoint estándar de OpenAI (`/v1/images/generations`), por lo que el builder oficial de OpenClaw no es compatible. Este plugin hace la llamada directa al endpoint de TokenHub.

## Requisitos

- OpenClaw 2026.x
- API key de Tencent TokenHub

## Instalación

### Desde GitHub

```bash
openclaw plugins install git:github.com/denisneuf/openclaw-tencent-tokenhub-hy-image-lite
```

### Desde local (desarrollo)

```bash
openclaw plugins install --link ./ruta/al/plugin
```

## Configuración

### 1. API Key

Asegúrate de tener `TOKENHUB_API_KEY` en tu entorno (`~/.openclaw/.env`):

```
TOKENHUB_API_KEY=***
```

### 2. Modelo por defecto (en `openclaw.json`)

```json
"agents": {
  "defaults": {
    "imageGenerationModel": {
      "primary": "tencent-tokenhub/hy-image-lite"
    }
  }
}
```

### 3. Plugin entries (solo si no se añadió automáticamente)

```json
"tencent-tokenhub": {
  "enabled": true
}
```

## Uso

Una vez configurado, el agente usará este provider automáticamente para `image_generate`. También puedes forzarlo:

```text
Genera una imagen de un gato con gafas
```

O llamar a la tool directamente:

```text
/tool image_generate action=generate model=tencent-tokenhub/hy-image-lite prompt="gato con gafas"
```

## Verificar que funciona

```bash
openclaw tools image_generate action=list
```

Deberías ver:

```
tencent-tokenhub (default hy-image-lite)
  models: hy-image-lite
  configured: yes
```

## Limitaciones

- **No soporta edición de imágenes** (solo generación desde texto)
- **No soporta sizes, aspect ratios ni resoluciones** — el endpoint usa su propio tamaño por defecto
- **Solo 1 imagen por llamada** (`maxCount: 1`)
- El endpoint **no sigue el estándar OpenAI** (`/v1/api/image/lite` en lugar de `/v1/images/generations`)

## Estructura del plugin

```
├── index.mjs              # Código del plugin (fetch directo al endpoint)
├── openclaw.plugin.json   # Manifiesto del plugin
└── package.json           # Metadatos del paquete npm
```

## Licencia

MIT
