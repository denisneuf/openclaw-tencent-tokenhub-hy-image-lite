# Tencent Hunyuan Image Lite — OpenClaw Plugin

Plugin no oficial para generar imágenes con **Tencent Hunyuan Image Lite (`hy-image-lite`)** a través de TokenHub.

No usa el endpoint estándar de OpenAI (`/v1/images/generations`), por lo que el builder oficial de OpenClaw no es compatible. Este plugin hace la llamada directa al endpoint de Hunyuan.

## Requisitos

- OpenClaw 2026.x
- API key de Tencent TokenHub o Hunyuan

## Instalación

### Desde GitHub

```bash
openclaw plugins install git:github.com/denisneuf/openclaw-tencent-hunyuan-image-lite
```

### Desde npm (si está publicado)

```bash
openclaw plugins install npm:openclaw-tencent-hunyuan-image-lite
```

### Desde local (desarrollo)

```bash
openclaw plugins install --link ./ruta/al/plugin
```

## Configuración

### 1. API Key

Asegúrate de tener `TOKENHUB_API_KEY` o `HUNYUAN_API_KEY` en tu entorno (`~/.openclaw/.env`):

```
TOKENHUB_API_KEY=sk-tu-key-aqui
```

### 2. Provider en `openclaw.json`

Añade este bloque dentro de `models.providers`:

```json
"tencent-hunyuan-image-lite": {
  "apiKey": "***",
  "baseUrl": "https://tokenhub.tencentmaas.com/v1/api/image/lite",
  "api": "openai-completions",
  "models": [
    {
      "id": "hy-image-lite",
      "name": "Hy Image Lite"
    }
  ]
}
```

### 3. Modelo por defecto (opcional)

En `agents.defaults`:

```json
"imageGenerationModel": {
  "primary": "tencent-hunyuan-image-lite/hy-image-lite"
}
```

### 4. Plugin entries

Si no se añadió automáticamente al instalar, verifica que `plugins.entries` tenga:

```json
"tencent-hunyuan-image-lite": {
  "enabled": true
}
```

## Uso

Una vez configurado, el agente usará este provider automáticamente para `image_generate` si está puesto como `imageGenerationModel.primary`. También puedes forzarlo:

```text
Genera una imagen de un gato con gafas
```

O llamar a la tool directamente con el modelo:

```text
/tool image_generate action=generate model=tencent-hunyuan-image-lite/hy-image-lite prompt="gato con gafas"
```

## Verificar que funciona

```bash
openclaw tools image_generate action=list
```

Deberías ver:

```
tencent-hunyuan-image-lite (default hy-image-lite)
  models: hy-image-lite
  configured: yes
```

## Limitaciones

- **No soporta edición de imágenes** (solo generación desde texto)
- **No soporta sizes, aspect ratios ni resoluciones** — Hunyuan Image Lite usa su propio tamaño por defecto
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
