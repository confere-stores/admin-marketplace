const isDiscount = (field, schema) => {
  if (field.includes('discount') && schema.type === 'object') {
    if (schema.properties.hasOwnProperty('value') && schema.properties.hasOwnProperty('type')) {
      return isNumber('value', schema.properties.value) && isEnum('type', schema.properties.type)
    }
  }
  return false
}

const isMoney = (field, schema) => {
  return (field.includes('amount') || field.includes('price')) && schema.type === 'number'
}

const isZipCode = (field, schema) => {
  return field.includes('zip') && schema.pattern === '^[0-9]{5}-?[0-9]{3}$'
}

const isUpload = (field, schema) => {
  return field.includes('icon') && schema.format === 'uri'
}

const isObject = (field, schema) => {
  return schema.type === 'object' && !isDiscount(field, schema)
}

const isEnum = (field, schema) => {
  return schema.type === 'string' && schema.hasOwnProperty('enum')
}

const isNumber = (field, schema) => {
  return ['integer', 'number'].includes(schema.type)
}

const isText = (field, schema) => {
  return schema.type === 'string'
}

const INPUTS = [
  { match: isDiscount, component: () => import(`../components/_inputs/InputDiscount.vue`) },
  { match: isObject, component: () => import(`../components/_inputs/InputObject.vue`) },
  { match: isMoney, component: () => import(`../components/_inputs/InputMoney.vue`) },
  { match: isZipCode, component: () => import(`../components/_inputs/InputZipCode.vue`) },
  { match: isUpload, component: () => import(`../components/_inputs/Upload.vue`) },
  { match: isEnum, component: () => import(`../components/_inputs/InputEnum.vue`) },
  { match: isText, component: () => import(`../components/_inputs/InputText.vue`) },
  { match: isNumber, component: () => import(`../components/_inputs/InputNumber.vue`) }
]

export const discover = (field, schema) => {
  for (let input of INPUTS) {
    if (input.match(field, schema)) {
      return [input.component]
    }
  }
}