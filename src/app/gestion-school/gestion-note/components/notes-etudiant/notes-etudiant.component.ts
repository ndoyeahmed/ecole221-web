import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {NoteProgrammeModuleModel} from "../../../../shared/models/note-programme-module.model";
import {MatPaginator} from "@angular/material/paginator";
import {NotesService} from "../../services/notes.service";
import {Subscription} from "rxjs";
import {InscriptionModel} from "../../../../shared/models/inscription.model";
import {DomSanitizer} from "@angular/platform-browser";
import {DevoirsModel} from "../../../../shared/models/devoirs.model";
import {NoteModel} from "../../../../shared/models/note.model";

/// <reference path ="../../node_modules/@types/jquery/index.d.ts"/>
declare var $: any;

@Component({
  selector: 'app-notes-etudiant',
  templateUrl: './notes-etudiant.component.html',
  styleUrls: ['./notes-etudiant.component.css']
})
export class NotesEtudiantComponent implements OnInit, AfterViewInit {
  subscription = [] as Subscription[];

  isNoteRemplacement = false;
  isNoteRemplacementok = true;

  listDevoirs = [] as DevoirsModel[];
  mdsNote: NoteModel;

  sessionList = [
    {id: 1, name: 'Normale'},
    {id: 2, name: 'Remplacement'}
  ];

  @Input() inscription: InscriptionModel;

  @Input() sessionModel: any;

  @Input() dataSource: MatTableDataSource<NoteProgrammeModuleModel>;

  etudiantNoteColumnsToDisplay = ['moduleEtudiant', 'moyenneDevoirsEtudiant', 'examEtudiant', 'sessionEtudiant'];

  constructor(
    private noteService: NotesService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  onSelectedSession(event) {
    this.isNoteRemplacement = this.sessionModel && this.sessionModel.id === 2;
  }

  secureUlr(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onChangeNoteExam(inscription, $event) {
    if (this.sessionModel && this.sessionModel.id === 2) {
      const newNote = $event.target.value;
      const listnote = JSON.parse(localStorage.getItem('list-note-etudiant')) as NoteProgrammeModuleModel[];
      listnote.forEach(ln => {
        if (Number(ln.id) === Number(inscription.id)) {
          if (Number(ln.note.nef) > Number(newNote)) {
            this.isNoteRemplacementok = false;
            inscription.styleNoteOnRemplacement = {color: 'red'};
            inscription.errorMessage = 'La note de remplacement doit etre supérieur à la note normale';
          } else {
            this.isNoteRemplacementok = true;
            inscription.styleNoteOnRemplacement = {color: 'black'};
            inscription.errorMessage = '';
          }
        }
      });
    }
  }

  onSelectedNoteSession(event, inscription) {
    inscription.isSessionRemplacementNote = event.checked === true;
    inscription.note.session = event.checked === true ? 1 : 0;
  }

  setNoteToRemplacementState(listnoteUpdated: NoteProgrammeModuleModel[]) {
    const listnote = JSON.parse(localStorage.getItem('list-note-etudiant')) as NoteProgrammeModuleModel[];
    for (const npm of listnote) {
      if (Number(npm.id) === Number(listnoteUpdated[listnote.indexOf(npm)].id)) {
        if (Number(npm.note.nef) === Number(listnoteUpdated[listnote.indexOf(npm)].note.nef)) {
          listnoteUpdated[listnote.indexOf(npm)].note.session = 0;
        } else {
          listnoteUpdated[listnote.indexOf(npm)].note.session = 1;
        }
      }
    }
  }

  valideNote() {
    if (this.sessionModel && this.sessionModel.id === 2) {
      this.setNoteToRemplacementState(this.dataSource.data);
      // console.log(this.dataSource.data);
    }
    if (this.dataSource.data && this.dataSource.data.length > 0) {
      this.dataSource.data.forEach(npm => {
        this.subscription.push(
          this.noteService.updateNote(npm.note, npm.programmeModule.id).subscribe(
            (data) => {
              // console.log(data);
             },
            (error) => console.log(error),
            () => {
            }
          )
        );
      });
    }
  }

  loadListDevoirByNote(note) {
    this.subscription.push(
      this.noteService.getAllDevoirsByNote(note.id).subscribe(
        (data) => {
          this.listDevoirs = data;
        }, (error) => console.log(error),
        () => {
          if (this.listDevoirs.length <= 0) {
            this.addNewInput();
            this.addNewInput();
          }
        }
      )
    );
  }

  addNewInput() {
    const devoir = new DevoirsModel();
    this.listDevoirs.push(devoir);
  }

  onAddNoteDevoir(note) {
    this.mdsNote = note;
    this.loadListDevoirByNote(note);
    $('#showDevoirModal').modal('show');
  }

  onDismissModal() {
    $('#showDevoirModal').modal('hide');
  }
}
