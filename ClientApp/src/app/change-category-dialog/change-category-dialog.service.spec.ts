import { TestBed } from '@angular/core/testing';

import { ChangeCategoryDialogService } from './change-category-dialog.service';

describe('ChangeCategoryDialogService', () => {
  let service: ChangeCategoryDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeCategoryDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
