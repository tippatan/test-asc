import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadWrComponent } from './file-upload-wr.component';

describe('FileUploadWrComponent', () => {
  let component: FileUploadWrComponent;
  let fixture: ComponentFixture<FileUploadWrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadWrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadWrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
