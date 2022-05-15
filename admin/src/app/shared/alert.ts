export interface Alert {
    answer: string;
    date: string;
    end: number;
    genId: string;
    ih: number;
    im: number;
    init: number;
    is: number;
    email: string;
    name: string;
    listQuesions:[{
        answer:string;
        form: string;
        id: number;
        question: string;
        option: [
            string
        ],
        
    }]
}
