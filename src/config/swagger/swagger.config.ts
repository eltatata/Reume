import YAML from 'yamljs';

const swaggerDocument = YAML.load('./openapi.yaml');

export const swaggerSpec = swaggerDocument;
