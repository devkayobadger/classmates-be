import { Router } from 'express'

import openApiDocument from './config/openapi.js'

const SWAGGER_UI_VERSION = '5.17.14'

const docsRouter = Router()

// OpenAPI JSON
docsRouter.get('/openapi.json', (_req, res) => {
  res.json(openApiDocument)
})

docsRouter.get('/docs/init.js', (_req, res) => {
  res.type('application/javascript').send(`window.onload = () => {
  window.ui = SwaggerUIBundle({
    url: '/api/openapi.json',
    dom_id: '#swagger-ui',
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'StandaloneLayout',
  })
}`)
})

docsRouter.get('/docs', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>API Docs</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${SWAGGER_UI_VERSION}/swagger-ui.min.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${SWAGGER_UI_VERSION}/swagger-ui-bundle.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/${SWAGGER_UI_VERSION}/swagger-ui-standalone-preset.min.js"></script>
  <script src="/api/docs/init.js"></script>
</body>
</html>`)
})

export default docsRouter
