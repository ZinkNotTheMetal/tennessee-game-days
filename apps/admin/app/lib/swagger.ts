import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", 
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'NEXTJS API Documentation',
        version: '1.0',
      },
      security: [],
    },
  })
  return spec
}