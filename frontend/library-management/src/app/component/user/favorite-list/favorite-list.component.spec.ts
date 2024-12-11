import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FavoriteListComponent } from './favorite-list.component';
import { FavoriteService } from '../../../service/favorite.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('FavoriteListComponent', () => {
  let component: FavoriteListComponent;
  let fixture: ComponentFixture<FavoriteListComponent>;
  let favoriteServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    favoriteServiceMock = jasmine.createSpyObj('FavoriteService', [
      'getFavoritesByUserId', 
      'deleteFavoriteByBookId' 
    ]);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
  
    favoriteServiceMock.getFavoritesByUserId.and.returnValue(of([]));
  
    TestBed.configureTestingModule({
      declarations: [FavoriteListComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: FavoriteService, useValue: favoriteServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });  

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch favorite list on init', () => {
    const favoriteList = [
      { favorite_id: 1, book_id: 101, user_id: 1, added_date: new Date(), title: 'Book 1', name: 'Author 1' },
      { favorite_id: 2, book_id: 102, user_id: 1, added_date: new Date(), title: 'Book 2', name: 'Author 2' }
    ];
  
    favoriteServiceMock.getFavoritesByUserId.and.returnValue(of(favoriteList));
  
    localStorage.setItem('user', JSON.stringify({ user_id: 1 }));
    component.ngOnInit();
  
    expect(favoriteServiceMock.getFavoritesByUserId).toHaveBeenCalledWith(1);
    expect(component.favorites.length).toBe(2);
    expect(component.favorites).toEqual(favoriteList);
  });
  it('should remove favorite from list when delete is confirmed', () => {
    const favoriteList = [
      { favorite_id: 1, book_id: 101, user_id: 1, added_date: new Date(), title: 'Book 1', name: 'Author 1' },
      { favorite_id: 2, book_id: 102, user_id: 1, added_date: new Date(), title: 'Book 2', name: 'Author 2' }
    ];

    favoriteServiceMock.getFavoritesByUserId.and.returnValue(of(favoriteList));
    favoriteServiceMock.deleteFavoriteByBookId.and.returnValue(of({}));

    localStorage.setItem('user', JSON.stringify({ user_id: 1 }));
    component.ngOnInit();

    spyOn(window, 'confirm').and.returnValue(true); 

    component.removeFavorite(101);

    expect(favoriteServiceMock.deleteFavoriteByBookId).toHaveBeenCalledWith(101);
    expect(component.favorites.length).toBe(1); 
    expect(component.favorites[0].favorite_id).toBe(2);
  }); 

  it('should remove favorite from list when delete is confirmed', () => {
    const favoriteList = [
      { favorite_id: 1, book_id: 101, user_id: 1, added_date: new Date(), title: 'Book 1', name: 'Author 1' },
      { favorite_id: 2, book_id: 102, user_id: 1, added_date: new Date(), title: 'Book 2', name: 'Author 2' }
    ];
  
    favoriteServiceMock.getFavoritesByUserId.and.returnValue(of(favoriteList));
    favoriteServiceMock.deleteFavoriteByBookId.and.returnValue(of({})); 
  
    localStorage.setItem('user', JSON.stringify({ user_id: 1 }));
    component.ngOnInit();
  
    spyOn(window, 'confirm').and.returnValue(true); 
  
    component.removeFavorite(101); 
  
    expect(favoriteServiceMock.deleteFavoriteByBookId).toHaveBeenCalledWith(101);
    expect(component.favorites.length).toBe(1); 
    expect(component.favorites[0].favorite_id).toBe(2); 
  });  
});
