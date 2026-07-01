export const laptopBrands = [
  { brand: 'Lenovo', lines: ['Legion', 'Yoga', 'ThinkBook', 'ThinkPad', 'IdeaPad', 'LOQ'] },
  { brand: 'Dell', lines: ['XPS', 'Latitude', 'Inspiron', 'Vostro', 'Precision', 'Alienware'] },
  { brand: 'Asus', lines: ['Zenbook', 'Vivobook', 'ROG', 'TUF', 'ProArt', 'ExpertBook'] },
  { brand: 'HP', lines: ['Pavilion', 'Envy', 'Spectre', 'EliteBook', 'ProBook', 'Omen'] },
  { brand: 'Laptop khác', lines: ['Apple MacBook', 'MSI', 'LG Gram', 'Microsoft Surface', 'Gigabyte'] },
] as const

export type LaptopBrandGroup = (typeof laptopBrands)[number]['brand']
