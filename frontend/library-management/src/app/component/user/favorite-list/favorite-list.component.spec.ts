import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FavoriteListComponent } from './favorite-list.component';
import { FavoriteService } from '../../../service/favorite.service';
import { Router } from '@angular/router';

describe('FavoriteListComponent', () => {
  let component: FavoriteListComponent;
  let fixture: ComponentFixture<FavoriteListComponent>;
  let favoriteServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    favoriteServiceMock = jasmine.createSpyObj('FavoriteService', ['getFavoritesByUserId', 'deleteFavorite']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [FavoriteListComponent],
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
    
    // Giả lập giá trị trả về từ getFavoritesByUserId
    favoriteServiceMock.getFavoritesByUserId.and.returnValue(of(favoriteList));

    // Giả lập thông tin userId từ localStorage
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
    favoriteServiceMock.deleteFavorite.and.returnValue(of({}));

    localStorage.setItem('user', JSON.stringify({ user_id: 1 }));
    component.ngOnInit();

    spyOn(window, 'confirm').and.returnValue(true); // Giả lập xác nhận xóa

    component.removeFavorite(1);

    expect(favoriteServiceMock.deleteFavorite).toHaveBeenCalledWith(1);
    expect(component.favorites.length).toBe(1);
    expect(component.favorites[0].favorite_id).toBe(2);
  });

  it('should not remove favorite if delete is canceled', () => {
    const favoriteList = [
      { favorite_id: 1, book_id: 101, user_id: 1, added_date: new Date(), title: 'Book 1', name: 'Author 1' },
      { favorite_id: 2, book_id: 102, user_id: 1, added_date: new Date(), title: 'Book 2', name: 'Author 2' }
    ];

    favoriteServiceMock.getFavoritesByUserId.and.returnValue(of(favoriteList));

    localStorage.setItem('user', JSON.stringify({ user_id: 1 }));
    component.ngOnInit();

    spyOn(window, 'confirm').and.returnValue(false); // Giả lập hủy xóa

    component.removeFavorite(1);

    expect(favoriteServiceMock.deleteFavorite).not.toHaveBeenCalled();
    expect(component.favorites.length).toBe(2); // Không có mục nào bị xóa
  });
});
