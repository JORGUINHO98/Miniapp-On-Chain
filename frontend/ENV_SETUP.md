# 🔧 Configuración de Variables de Entorno

## Dirección del Contrato Configurada

La dirección del contrato ya está configurada en `src/config.js`:
- **Contrato:** `0x8Ece51AD589EcB9dFcEBeaC4eFCE3998d269f0E0`
- **Red:** Sepolia Testnet

## Configuración Opcional (Archivo .env)

Si quieres usar un archivo `.env` para sobrescribir la configuración, crea un archivo `.env` en la carpeta `frontend/` con el siguiente contenido:

```env
VITE_API_URL=http://localhost:3000
VITE_CONTRACT_ADDRESS=0x8Ece51AD589EcB9dFcEBeaC4eFCE3998d269f0E0
VITE_PROVIDER_URL=https://sepolia.infura.io/v3/TU_INFURA_KEY
```

## Importante

- El frontend ya está configurado con la dirección del contrato por defecto
- No necesitas crear el archivo `.env` a menos que quieras cambiar la configuración
- Si creas el archivo `.env`, reinicia el servidor de desarrollo (`npm run dev`)

## Verificar la Configuración

Para verificar que la dirección está configurada correctamente:

1. Abre la consola del navegador (F12)
2. Deberías ver la dirección del contrato en los logs
3. O revisa `src/config.js` - la dirección ya está ahí

