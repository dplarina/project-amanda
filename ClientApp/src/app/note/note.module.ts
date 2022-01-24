import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoteComponent } from '../note/note.component';

@NgModule({
  declarations: [NoteComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  exports: [NoteComponent]
})
export class NoteModule {}
