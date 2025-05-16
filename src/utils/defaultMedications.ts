import { PrescriptionItem } from "@/components/PrescriptionTable";

export const defaultMedications: Omit<PrescriptionItem, 'id'>[] = [
  {
    medication: 'DIETA LIVRE',
    dose: '',
    route: 'ORAL',
    frequency: '8/8H',
    notes: '',
    time: '',
    options: {
      medication: ['DIETA LIVRE', 'DIETA SNG', 'DIETA SNE', 'JEJUM']
    }
  },
  {
    medication: 'CRSV + S02',
    dose: '',
    route: '',
    frequency: '6/6H',
    notes: '',
    time: ''
  },
  {
    medication: 'CONTROLE E HGT',
    dose: '',
    route: 'ORAL',
    frequency: '12/12H',
    notes: '',
    time: ''
  },
  {
    medication: 'AVP SALINIZADO',
    dose: '',
    route: 'VENOSA',
    frequency: '24/24H',
    notes: '',
    time: ''
  },
  {
    medication: 'O2 ÚMIDO EM CATETER NASAL',
    dose: '2L/MIM',
    route: 'INALATÓRIA',
    frequency: 'SE SATO2 <93% AA',
    notes: 'ALVO SATO2 94-96%',
    time: '',
    options: {
      dose: ['2L/MIM', '3L/MIM', '4L/MIM', '5L/MIM']
    }
  },
  {
    medication: 'SORO',
    dose: '500ML',
    route: 'VENOSA',
    frequency: '12/12H',
    notes: 'ACM',
    time: '',
    options: {
      medication: ['FISIOLÓGICO 0,9%', 'RINGER LACTATO', 'SORO GLICOSADO 5%'],
      dose: ['100ML', '250ML', '500ML', '1000ML'],
      frequency: ['6/6H', '8/8H', '12/12H']
    }
  },
  {
    medication: 'DIPIRONA',
    dose: '1 AMP',
    route: 'VENOSA',
    frequency: '6/6H',
    notes: 'SE DOR OU Tax >37,5ºC',
    time: ''
  },
  {
    medication: 'ONDASETRONA',
    dose: '1 AMP',
    route: 'VENOSA',
    frequency: '8/8H',
    notes: 'SE NÁUSEA OU VÔMITOS',
    time: ''
  },
  {
    medication: 'GLICOSE 50%',
    dose: '2 AMP',
    route: 'VENOSA',
    frequency: 'SE HGT<70',
    notes: 'ATENÇÃO',
    time: ''
  },
  {
    medication: 'INSULINA REGULAR',
    dose: 'AVALIAR HGT',
    route: 'SUBCUTÂNEA',
    frequency: 'Até 180 = 0 unidades;\n181-200 = 2 unidades;\n201-250 = 4 unidades;\n251-300 = 6 unidades;\n301-350 = 8 unidades;\n351-400 = 10 unidades;\nSe >400 ou <60 AVISAR',
    notes: 'ATENÇÃO',
    time: ''
  }
]; 