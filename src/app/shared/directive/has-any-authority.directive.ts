import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../../authentication/services/auth.service';

@Directive({
  selector: '[appHasAnyAuthority]'
})
export class HasAnyAuthorityDirective {

  private authorities: string[];

  constructor(
    private auth: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  @Input()
  set appHasAnyAuthority(value: string[]) {
    this.authorities = value;
    this.updateView();
  }

  private updateView() {
    this.viewContainerRef.clear();
    this.auth.identity().subscribe(user => {
      if (this.auth.hasAuthority(this.authorities, user)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    });
  }
}
