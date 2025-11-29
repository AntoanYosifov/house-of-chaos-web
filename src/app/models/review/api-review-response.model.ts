export interface ApiReviewResponseModel {
    id: string;
    authorId: string;
    authorName?: string; // For future use
    subjectId: string; // productId
    body: string;
}

