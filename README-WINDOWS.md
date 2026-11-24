# ALTA ENERGÍA 107.5 — Instalador de Windows

Este proyecto está configurado con **Electron** y **electron-builder** para generar el instalador `.exe` de Windows usando `npm install`.

## Requisitos en Windows
- [Node.js](https://nodejs.org/) (v18 o superior)

## Pasos para crear el instalador `.exe`

1. Abre una terminal (CMD o PowerShell) dentro de la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Genera el instalador de Windows:
   ```bash
   npm run dist:win
   ```

Al finalizar, el instalador se creará en:
- `release/alta-energia-107.5-setup.exe`

Incluye selector de carpeta de instalación, icono oficial de **AE RADIO**, acceso directo en el Escritorio y en el Menú Inicio.

## Probar la app de escritorio sin generar el instalador
```bash
npm run build
npm run electron:start
```
