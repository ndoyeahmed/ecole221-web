import {Component, Input, OnInit} from '@angular/core';
import {DevoirsModel} from "../../../../shared/models/devoirs.model";
import {NotesService} from "../../services/notes.service";
import {NoteModel} from "../../../../shared/models/note.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-devoirs-list',
  templateUrl: './devoirs-list.component.html',
  styleUrls: ['./devoirs-list.component.css']
})
export class DevoirsListComponent implements OnInit {

  subscription = [] as Subscription[];
  @Input() listDevoirs: DevoirsModel[];
  @Input() note: NoteModel;

  constructor(
    private noteService: NotesService
  ) { }

  ngOnInit(): void {
  }

  addNewInput() {
    const devoir = new DevoirsModel();
    this.listDevoirs.push(devoir);
  }

  deleteInput(noteInputId) {
    this.listDevoirs.splice(noteInputId, 1);
  }

  setNoteToNewDevoir() {
    this.listDevoirs.forEach(d => {
      d.note = this.note;
    });
  }

  saveListNote() {
    this.setNoteToNewDevoir();
    let moyenneDevoirs = 0;
    let sommeDevoir = 0;
    this.listDevoirs.forEach(devoir => {
      sommeDevoir = sommeDevoir + Number(devoir.noteDevoire);
      this.subscription.push(
        (devoir.id ? this.noteService.updateDevoir(devoir.id, devoir)
          : this.noteService.addDevoir(devoir))
          .subscribe(
          (data) => {
            // console.log(data);
          }, (error) => console.log(error)
        )
      );
    });

    moyenneDevoirs = sommeDevoir / this.listDevoirs.length;
    this.note.mds = moyenneDevoirs;
    this.subscription.push(
      this.noteService.updateMoyenneDevoir(this.note.id, this.note).subscribe(
        (data) => {
          // console.log(data);
        }, (error) => console.log(error)
      )
    );
  }
}
