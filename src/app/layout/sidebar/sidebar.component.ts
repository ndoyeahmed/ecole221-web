import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // @ts-ignore
    $(document).ready(() => {
      // @ts-ignore
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
    });
  }

}
