export interface ReviewAppModel {
    id: string;
    authorId: string;
    authorName?: string; // For future use when backend includes it
    subjectId: string; // productId
    body: string;
}

