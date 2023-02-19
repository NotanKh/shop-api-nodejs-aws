export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    count: { type: 'number' },
    price: { type: 'number' },
  },
  required: ['name'],
} as const;
