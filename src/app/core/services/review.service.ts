import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ReviewAppModel} from "../../models/review";
import {ApiReviewRequestModel} from "../../models/review";
import {ApiReviewResponseModel} from "../../models/review";

@Injectable({providedIn: 'root'})
export class ReviewService {
    private apiUrl: string = 'http://localhost:8080/api/v1/reviews';

    constructor(private httpClient: HttpClient) {
    }

    createReview$(productId: string, body: string, authorId: string, authorName: string): Observable<ReviewAppModel> {
        const request: ApiReviewRequestModel = {
            authorId: authorId,
            authorName: authorName,
            subjectId: productId,
            body: body
        };

        return this.httpClient.post<ApiReviewResponseModel>(`${this.apiUrl}`, request).pipe(
            map(apiResponse => this.mapApiModelToAppModel(apiResponse))
        );
    }

    getReviewsByProductId$(productId: string): Observable<ReviewAppModel[]> {
        return this.httpClient.get<ApiReviewResponseModel[]>(`${this.apiUrl}/product/${productId}`).pipe(
            map(apiResponses => apiResponses.map(api => this.mapApiModelToAppModel(api)))
        );
    }

    private mapApiModelToAppModel(apiReviewResponse: ApiReviewResponseModel): ReviewAppModel {
        return {
            id: apiReviewResponse.id,
            authorId: apiReviewResponse.authorId,
            authorName: apiReviewResponse.authorName,
            subjectId: apiReviewResponse.subjectId,
            body: apiReviewResponse.body
        };
    }
}

