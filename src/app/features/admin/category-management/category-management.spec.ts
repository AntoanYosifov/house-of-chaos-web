import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {CategoryManagement} from './category-management';
import {CategoryService} from '../../../core/services/category.service';

class CategoryServiceMock {
    getAll$ = jasmine.createSpy('getAll$').and.returnValue(of([]));
    addCategory$ = jasmine.createSpy('addCategory$').and.returnValue(of({id: '1', name: 'Chairs'}));
}

describe('CategoryManagement', () => {
    let component: CategoryManagement;
    let fixture: ComponentFixture<CategoryManagement>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CategoryManagement],
            providers: [
                {provide: CategoryService, useClass: CategoryServiceMock}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CategoryManagement);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

