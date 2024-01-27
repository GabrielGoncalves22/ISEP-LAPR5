import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface MenuToggle {
    collapsed: boolean;
    screenWidth: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
    title = 'UI';

    isMenuCollapsed = false;
    screenWidth = 0;

    constructor(private router: Router) { }

    onToggleMenu(data: MenuToggle): void {
        this.isMenuCollapsed = data.collapsed;
        this.screenWidth = data.screenWidth;
    }

    isLoginRoute(): boolean {
        return this.router.url.includes('login');
    }

    isRegisterRoute(): boolean {
        return this.router.url.includes('register');
    }
}
