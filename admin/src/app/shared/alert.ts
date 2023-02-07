export interface Alert {
  answer: string;
  answerOn: string;
  date: string;
  email: string;
  end: number;
  genId: string;
  ih: number;
  im: number;
  init: number;
  is: number;
  listQuesions: [{
    answer: string;
    form: string;
    id: number;
    question: string;
    isOptional: string;
    option: [
      string
    ],

  }];
  mode: number;
  name: string;
  question:string;
  status: string;
  timestamp: number;
  userId: string;

}
