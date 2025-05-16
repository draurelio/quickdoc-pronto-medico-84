import { formatDate } from '../utils/formatUtils';

export interface OralMedication {
  id: string;
  name: string;
  dosage: string | string[];
  route: string;
  posology: string | string[];
  observation: string;
  schedule: string;
}

const currentDate = formatDate(new Date().toISOString().slice(0, 10));

export const oralMedications: OralMedication[] = [
  {
    id: '1',
    name: 'ÁCIDO ACETILSALICÍLICO (AAS)',
    dosage: '100MG',
    route: 'ORAL',
    posology: ['1X AO DIA', '2PCP AGORA', '3CP AGORA'],
    observation: '',
    schedule: ''
  },
  {
    id: '2',
    name: 'ACICLOVIR',
    dosage: ['200MG', '400MG', '600MG', '800MG', '1000MG'],
    route: 'ORAL',
    posology: ['4/4H', '6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '3',
    name: 'AMIODARONA',
    dosage: '200MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '4',
    name: 'AMINONOFILINA',
    dosage: '100MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '5',
    name: 'AMOXICILINA',
    dosage: '500MG',
    route: 'ORAL',
    posology: ['8/8H', '12/12H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '6',
    name: 'ANLODIPINO',
    dosage: '5MG',
    route: 'ORAL',
    posology: ['8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '7',
    name: 'ATENOLOL',
    dosage: ['25MG', '50MG'],
    route: 'ORAL',
    posology: ['8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '8',
    name: 'ATORVASTATINA',
    dosage: '100MG',
    route: 'ORAL',
    posology: ['24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '9',
    name: 'AZITROMICINA',
    dosage: ['500MG', '1000MG'],
    route: 'ORAL',
    posology: ['24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '10',
    name: 'CAPTOPRIL',
    dosage: ['25MG', '50MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '11',
    name: 'CARVEDILOL',
    dosage: ['6,25MG', '12,5MG', '25MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '12',
    name: 'CEFALEXINA',
    dosage: '500MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '13',
    name: 'CIPROFLOXACINO',
    dosage: '500MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '14',
    name: 'CLOPIDOGREL',
    dosage: ['75MG', '150MG', '300MG'],
    route: 'ORAL',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '15',
    name: 'DABIGATRANA',
    dosage: '150MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '16',
    name: 'DIGOXINA',
    dosage: '0,25MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '17',
    name: 'ENALAPRIL',
    dosage: '10MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '18',
    name: 'ESPIRONOLACTONA',
    dosage: ['25MG', '50MG', '100MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '19',
    name: 'FUROSEMIDA',
    dosage: ['40MG', '80MG', '120MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '20',
    name: 'FLUCONAZOL',
    dosage: '100MG',
    route: 'ORAL',
    posology: ['12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '21',
    name: 'GLIBENCLAMIDA',
    dosage: '5MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '22',
    name: 'LEVOFLOXACINO',
    dosage: '500MG',
    route: 'ORAL',
    posology: '24H',
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '23',
    name: 'LOSARTANA',
    dosage: '50MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '24',
    name: 'METFORMINA',
    dosage: '850MG',
    route: 'ORAL',
    posology: ['8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '25',
    name: 'METILDOPA',
    dosage: '250MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '26',
    name: 'METRONIDAZOL',
    dosage: ['250MG', '500MG'],
    route: 'ORAL',
    posology: ['8/8H', '12/12H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '27',
    name: 'MIDAZOLAM',
    dosage: '15MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '28',
    name: 'NIFEDIPINO',
    dosage: ['10MG', '20MG', '40MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '29',
    name: 'NIMESULIDA',
    dosage: '100MG',
    route: 'ORAL',
    posology: ['12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '30',
    name: 'OMEPRAZOL',
    dosage: ['20MG', '40MG'],
    route: 'ORAL',
    posology: ['MANHÃ EM JEJUM', '12/12H'],
    observation: '',
    schedule: ''
  },
  {
    id: '31',
    name: 'OSELTAMIVIR',
    dosage: '75MG',
    route: 'ORAL',
    posology: ['12/12H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '32',
    name: 'PARACETAMOL',
    dosage: '500MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '33',
    name: 'PENTOXIFILINA',
    dosage: '400MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '34',
    name: 'PREDNISONA',
    dosage: ['20MG', '40MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '35',
    name: 'PROPATILNITRATO (SUSTRATE)',
    dosage: '10MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '36',
    name: 'PROPRANOLOL',
    dosage: '40MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '37',
    name: 'QUELATO DE FERRO + ÁCIDO FÓLICO + CIANOCOBALAMINA',
    dosage: '300 MG + 5MG + 15.000CMG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: 'CORRESPONDENTE A 41,66 MG DE FERRO ELEMENTAR',
    schedule: ''
  },
  {
    id: '38',
    name: 'SULFATO FERROSO',
    dosage: '40MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '39',
    name: 'SULFAMETOXAZOL + TRIMETROPINA',
    dosage: ['400MG + 80MG', '800MG + 160MG'],
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '40',
    name: 'VERAPAMIL',
    dosage: '40MG',
    route: 'ORAL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  }
]; 