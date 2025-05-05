import { formatDate } from '../utils/formatUtils';

export interface InjectableMedication {
  id: string;
  name: string;
  dosage: string | string[];
  route: string | string[];
  posology: string | string[];
  observation: string;
  schedule: string;
}

const currentDate = formatDate(new Date().toISOString().slice(0, 10));

export const injectableMedications: InjectableMedication[] = [
  {
    id: '1',
    name: 'AMINOFILINA',
    dosage: '24MG/10ML',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '2',
    name: 'AMPICILINA',
    dosage: '1G',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '3',
    name: 'AMIODARONA',
    dosage: ['50MG/3ML 1 AMP', '50MG/3ML 2 AMP', '50MG/3ML 3 AMP', '50MG/3ML 4 AMP'],
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '4',
    name: 'SULF. ATROPINA',
    dosage: ['0,5MG/1ML 1AMP', '0,5MG/1ML 2AMP', '0,5MG/1ML 3AMP'],
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '5',
    name: 'BENZILPENICILINA POTÁSSICA',
    dosage: '5.000 UI',
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '6',
    name: 'BESILATO ATRACÚRIO',
    dosage: 'DOSE',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '7',
    name: 'BICARBONATO DE SÓDIO',
    dosage: '8,4% - 10ML',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '8',
    name: 'BROMOPRIDA',
    dosage: '1 AMP (5MG/ML - 2ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '9',
    name: 'BROMETO DE PANCURÔNIO',
    dosage: '1AMP',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '10',
    name: 'CEFAZOLINA',
    dosage: '1G',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '11',
    name: 'CEFTRIAXONA',
    dosage: ['1G', '2G'],
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '12',
    name: 'CETOPROFENO',
    dosage: '100MG',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '13',
    name: 'CEFEPIMA',
    dosage: '1G',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '14',
    name: 'CLINDAMICINA',
    dosage: '1 AMP - (150MG/ ML - 4ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '15',
    name: 'CLOR. DE BUPIVACAÍNA + GLICOSE 8% RAQUIANESTESIA 0,50% (NEOCAINA PESADA)',
    dosage: '5 MG/ML',
    route: 'INJETÁVEL',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: 'RAQUIANESTESIA 0,50%',
    schedule: ''
  },
  {
    id: '16',
    name: 'CLOR. DE BUPIVACAÍNA PARA RAQUIANESTESIA 0,50% (NEOCAINA ISOBÁRICA)',
    dosage: '5 MG/ML',
    route: 'INJETÁVEL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '17',
    name: 'CLOR. CETAMINA (KETAMIN)',
    dosage: '1 AMP (50 MG/ 10 ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '18',
    name: 'CLOR. DE CLONIDINA (CLONIDIN)',
    dosage: '1 AMP (150 MCG/ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '19',
    name: 'CLOR. DE DEXTROCETAMINA (KETAMIN NP)',
    dosage: '1 AMP (50 MG/ 2 ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '20',
    name: 'CLOR. ETILEFRINA 10 MG/ML (EPORTIL)',
    dosage: '1AMP (10 MG/ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '21',
    name: 'CITRATO DE FENTALINA (FENTANIL)',
    dosage: '1 AMP (78,5 MCG – 2 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '22',
    name: 'CLOR. FENTANILA (FENTANIL)',
    dosage: '1 AMP(78,5 MCG-10 ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '23',
    name: 'CLOR. DOPAMINA',
    dosage: '1AMP(250 MG/20 ML)',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '24',
    name: 'CLOR. HIDRALAZINA',
    dosage: '20 MG/ 1 ML',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '25',
    name: 'CLOR. LIDOCAÍNA SEM VASOCONTRITOR',
    dosage: '20 MG/ML 20%',
    route: 'INJETÁVEL',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '26',
    name: 'CLOR. LIDOCAÍNA HEMITARTARATO DE EPINEFRINA 1: 200.000 EM EPINEFRINA 2,0%',
    dosage: '20 MG/ML-20 ML',
    route: 'INJETÁVEL',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '27',
    name: 'CLOR. LIDOCAÍNA 2,0%',
    dosage: '20 MG/ML',
    route: 'INJETÁVEL',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '28',
    name: 'CLOR. METOCLOPRAMIDA(PLASIL)',
    dosage: '1 AMP',
    route: 'IV',
    posology: ['6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '29',
    name: 'CLOR. NALOXONA(NARCAN)',
    dosage: '0,4 MG/ML',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '30',
    name: 'CLOR. DE NALBUFINA(NUBAIN)',
    dosage: '10 MG/ML',
    route: ['IV', 'INJETÁVEL'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '31',
    name: 'CLORETO DE POTÁSSIO',
    dosage: '1 AMP(10 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '32',
    name: 'CLORETO DE SÓDIO 2,0%',
    dosage: '1AMP (2,0% - 10ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '33',
    name: 'CLOR. PROMETAZINA(FENERGAM)',
    dosage: '1AMP (50 MG/ 2 ML)',
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '34',
    name: 'CLOR. PROTAMINA',
    dosage: '1 AMP(1000 UL/ML)',
    route: ['IV', 'INJETÁVEL'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '35',
    name: 'CLOR. RANITIDINA',
    dosage: '1 AMP',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '36',
    name: 'CLOR. ROPIVACAÍNA',
    dosage: '1AMP(10 MG/ML – 20 ML)',
    route: ['IV', 'INJETÁVEL'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '37',
    name: 'CLOR. TRAMADOL(TRAMADOL)',
    dosage: '1AMP(100MG/ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '38',
    name: 'COMPLEXO B',
    dosage: '1AMP',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '39',
    name: 'DESLANOSIDEO',
    dosage: '1AMP(0,2MG/2ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '40',
    name: 'DEXAMETASONA',
    dosage: ['1AMP(4MG/2,5ML)', '1AMP(2MG/ML)'],
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '41',
    name: 'DICLOFENADO SÓDICO',
    dosage: '1AMP(25MG/3ML)',
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '42',
    name: 'DIMENIDRATO B6',
    dosage: '1AMP(10ML)',
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '43',
    name: 'DIPIRONA SÓDICA',
    dosage: '1AMP(500MG/2ML)',
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '44',
    name: 'DOPAMINA IV 5 MG/ 10 ML',
    dosage: '1AMP(5MG/10 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '45',
    name: 'EPINEFRINA(ADRENALINA)',
    dosage: '1AMP(1 MG/ML)',
    route: ['IV', 'INJETÁVEL', 'INALATÓRIA'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '46',
    name: 'ESCOPOLAMINA',
    dosage: '1AMP(20 MG/ 1 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '47',
    name: 'DIPIRONA SÓDICA + ESCOPOLAMINA',
    dosage: '1AMP(4 MG + 500 MG/ML)',
    route: ['IV', 'INJETÁVEL'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '48',
    name: 'FENITOÍNA SÓDICA',
    dosage: '1 AMP',
    route: ['IV', 'IM'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '49',
    name: 'FENOBARBITAL',
    dosage: '1AMP(200 MG/2 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '50',
    name: 'FLUMAZENIL',
    dosage: '1AMP(0,1 MG/ML-5 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '51',
    name: 'FUROSEMIDA',
    dosage: ['1AMP(10MG/ML-2ML)', '2AMP(10MG/ML-2ML)', '3AMP(10MG/ML-2ML)', '4AMP(10MG/ML-2ML)', '5AMP(10MG/ML-2ML)'],
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '52',
    name: 'GENTAMICINA 40 MG / 2 ML',
    dosage: '1AMP(40MG/ML-2 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '53',
    name: 'GLICOSE',
    dosage: '1AMP(50%-10 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '54',
    name: 'GLICONATO DE CÁLCIO',
    dosage: '1AMP(50 MG/ML -10 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '55',
    name: 'HALOPERIDOL(HADOL)',
    dosage: '1AMP(5 MG/ML–1 ML)',
    route: 'IM',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '56',
    name: 'HEMITARTARATO NOREPINEFRINA',
    dosage: '1AMP',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '57',
    name: 'HIDROCORTIZONA',
    dosage: '1AMP(500 MG)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '58',
    name: 'ISOSSORBIDA(ISORDIL –MONOCARDIL)',
    dosage: '1AMP(10 MG/1 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '59',
    name: 'METILSULFATO DE NEOSTIGINA(PROSTIGMINE)',
    dosage: '1AMP(0,5 MG/1 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '60',
    name: 'METRONIDAZOL',
    dosage: '1AMP(0,5 MG/ 100 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  },
  {
    id: '61',
    name: 'MIDAZOLAM (DORMONID)',
    dosage: ['1AMP(5MG/ML-3ML)', '1AMP(5MG/ML-10 ML)'],
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '62',
    name: 'LIDOCAÍNA SPRAY',
    dosage: '1 FRASCO',
    route: 'TÓPICO',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '63',
    name: 'NITROPRUSSETO DE SÓDIO',
    dosage: '1AMP',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '64',
    name: 'OMEPRAZOL',
    dosage: '1AMP(40MG/ML–10 ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '65',
    name: 'ONDASETRONA(NAUSEDRON)',
    dosage: '1AMP(2MG/ML–2ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '66',
    name: 'OXITOCINA 500',
    dosage: '1AMP(500MG)',
    route: ['IV', 'IM', 'SC'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '67',
    name: 'PENTOXIFILINA',
    dosage: '1AMP(20MG/ML–5ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '68',
    name: 'PETIDINA(DOLANTINA)',
    dosage: '1AMP(50MG/ML–2ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '69',
    name: 'PROPOFOL',
    dosage: '1AMP(10MG/ML–20ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '70',
    name: 'SUXAMETÔNIO(SUCCINIL)',
    dosage: '1AMP(100 MG/ML)',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '71',
    name: 'SEVOFLURANO(SEVORANE)',
    dosage: '1AMP(100 ML)',
    route: '',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '72',
    name: 'SULFATO DE MAGNÉSIO',
    dosage: '1AMP',
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '73',
    name: 'SULFATO TERBUTALINA',
    dosage: '1AMP',
    route: ['IV', 'SC'],
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '74',
    name: 'TRANEXÂMICO (ÁCIDO TRANEXÂMICO)',
    dosage: ['1AMP', '2AMP', '3AMP', '4AMP'],
    route: 'IV',
    posology: ['AGORA', '6/6H', '8/8H', '12/12H', '24H'],
    observation: '',
    schedule: ''
  },
  {
    id: '75',
    name: 'LEVOFLOXACINO',
    dosage: '1AMP(500MG)',
    route: 'IV',
    posology: ['24H'],
    observation: `IN ${currentDate}`,
    schedule: ''
  }
]; 