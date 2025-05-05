import { formatDate } from '../utils/formatUtils';

export interface Antibiotic {
  id: string;
  name: string;
  dosage: string | string[];
  route: string | string[];
  posology: string | string[];
  observation: string | string[];
  schedule: string | string[];
  type: 'injectable' | 'oral';
}

const currentDate = formatDate(new Date().toISOString().slice(0, 10));

export const injectableAntibiotics: Antibiotic[] = [
  {
    id: '1',
    name: 'BENZILPENICILINA BENZATINA',
    dosage: ['600.000 UI', '1.200.000 UI'],
    route: 'IM',
    posology: 'DOSE ÚNICA',
    observation: `IN ${currentDate}`,
    schedule: '-',
    type: 'injectable'
  },
  {
    id: '2',
    name: 'CEFTRIAXONA',
    dosage: ['500 MG', '1 G'],
    route: 'EV',
    posology: ['12/12H', '24/24H'],
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '3',
    name: 'METRONIDAZOL',
    dosage: '500 MG',
    route: 'EV',
    posology: ['8/8H', '12/12H'],
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '4',
    name: 'CLINDAMICINA',
    dosage: '600 MG',
    route: 'IV',
    posology: '6/6 H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '5',
    name: 'GENTAMICINA',
    dosage: '40 MG/ML',
    route: ['IV', 'IM'],
    posology: '',
    observation: `IN ${currentDate}`,
    schedule: 'S/N',
    type: 'injectable'
  },
  {
    id: '6',
    name: 'OXACILINA',
    dosage: '1 G',
    route: 'IV',
    posology: '4/4 H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '7',
    name: 'CIPROFLOXACINO',
    dosage: '500 MG',
    route: ['VO', 'EV'],
    posology: '12/12 H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '8',
    name: 'LEVOFLOXACINO',
    dosage: '500 MG',
    route: 'VO',
    posology: '24 H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '9',
    name: 'AZITROMICINA',
    dosage: '500 MG',
    route: 'VO',
    posology: '24 H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '10',
    name: 'CLARITROMICINA',
    dosage: '500 MG',
    route: 'EV',
    posology: '12/12 H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '11',
    name: 'FOSFOMICINA SÓDICA',
    dosage: '3 G',
    route: 'EV',
    posology: 'DOSE ÚNICA',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '25',
    name: 'AMOXICILINA SÓDICA + CLAVULANATO DE POTÁSSIO',
    dosage: '1000MG +200MG',
    route: 'IV',
    posology: '12/12H',
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  },
  {
    id: '26',
    name: 'METRONIDAZOL',
    dosage: '250MG',
    route: 'VO',
    posology: ['12/12H', '8/8H'],
    observation: `IN ${currentDate}`,
    schedule: '',
    type: 'injectable'
  }
];

export const oralAntibiotics: Antibiotic[] = [
  {
    id: '1',
    name: 'AMOXICILINA',
    dosage: '500 MG (COMPRIMIDO OU CÁPSULA)',
    route: 'ORAL',
    posology: '8/8H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '2',
    name: 'AMOXICILINA + CLAVULANATO',
    dosage: '500 MG + 125 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: ['8/8H', '12/12H'],
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '3',
    name: 'FENOXIMETILPENICILINA POTÁSSICA',
    dosage: '250–500 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '6/6H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '4',
    name: 'CEFALEXINA',
    dosage: '500 MG (COMPRIMIDO OU CÁPSULA)',
    route: 'ORAL',
    posology: '6/6H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '5',
    name: 'CIPROFLOXACINO',
    dosage: '500 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '12/12 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '6',
    name: 'LEVOFLOXACINO',
    dosage: '500 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '1X DIA',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '7',
    name: 'AZITROMICINA',
    dosage: '500 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '1X DIA',
    observation: '',
    schedule: '',
    type: 'oral'
  },
  {
    id: '8',
    name: 'CLARITROMICINA',
    dosage: '500 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '12/12H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '9',
    name: 'CLORANFENICOL',
    dosage: '250 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '6/6H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '10',
    name: 'CLINDAMICINA',
    dosage: ['300 MG (CÁPSULA)', '150 MG (CÁPSULA)'],
    route: 'ORAL',
    posology: '6/6 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '11',
    name: 'DOXICICLINA',
    dosage: '100 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '12/12H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '13',
    name: 'MOXIFLOXACINO',
    dosage: '400 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '24/24 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '14',
    name: 'TETRACICLINA',
    dosage: '500 MG (CÁPSULA)',
    route: 'ORAL',
    posology: '6/6 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '15',
    name: 'SULFADIAZINA',
    dosage: '500 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '6/6 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '16',
    name: 'SULFAMETOXAZOL + TRIMETOPRIMA',
    dosage: ['400 MG + 80 MG', '800 MG + 160 MG'],
    route: 'ORAL',
    posology: '12/12 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '17',
    name: 'NITROFURANTOÍNA',
    dosage: '100 MG (CÁPSULA)',
    route: 'ORAL',
    posology: '6/6 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '18',
    name: 'LINEZOLIDA',
    dosage: '600 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '12/12 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  },
  {
    id: '19',
    name: 'OFLOXACINO',
    dosage: '400 MG (COMPRIMIDO)',
    route: 'ORAL',
    posology: '12/12 H',
    observation: '',
    schedule: 'S/N',
    type: 'oral'
  }
]; 