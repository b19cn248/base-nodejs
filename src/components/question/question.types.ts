export interface IQuestion {
    title: string;
    description: string;
    content: string;
    setQuestionId: string;
}

export interface IQuestionDTO {
    id: string;
    title: string;
    description: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    setQuestionId: string;
}