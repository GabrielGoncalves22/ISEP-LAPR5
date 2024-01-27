import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

import { navbarDataCampus, navbarDataFleet, navbarDataSystem, navbarDataTask, navbarDataUser } from './nav-data';
import { INavbarData, fadeInOut } from "../menu/helper";
import { AuthService } from '../authentication/auth.service';
import { Role } from '../user/models/role';

interface MenuToggle {
    collapsed: boolean;
    screenWidth: number;
}

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    animations: [
        fadeInOut,
        trigger('rotate', [
            transition(':enter', [
                animate('1000ms',
                    keyframes([
                        style({ transform: 'rotate(0deg)', offset: '0' }),
                        style({ transform: 'rotate(2turn)', offset: '1' })
                    ])
                )
            ])
        ])
    ]
})

export class MenuComponent implements OnInit {

    @Output() onToggleMenu: EventEmitter<MenuToggle> = new EventEmitter();

    collapsed = true;
    screenWidth = 0;
    navData = null as any;
    multiple: boolean = false;

    @HostListener('window:resize', ['$event'])

    onResize(event: any) {
        this.screenWidth = window.innerWidth;
        if (this.screenWidth <= 768) {
            this.collapsed = false;
            this.onToggleMenu.emit({ collapsed: this.collapsed, screenWidth: window.innerWidth });

        }
    }

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.onToggleMenu.emit({ collapsed: this.collapsed, screenWidth: window.innerWidth });

        this.updateMenu(this.authService.getRole());
    }

    toggleCollapse(): void {
        this.collapsed = !this.collapsed;
        this.onToggleMenu.emit({ collapsed: this.collapsed, screenWidth: window.innerWidth });
    }

    closeMenu(): void {
        this.collapsed = false;
        this.onToggleMenu.emit({ collapsed: this.collapsed, screenWidth: window.innerWidth });
    }

    handleClick(item: INavbarData): void {
        this.skrinkItems(item);
        item.expanded = !item.expanded;
    }

    getActiveClass(data: INavbarData): string {
        return this.router.url.includes(data.routeLink) ? 'active' : '';
    }

    skrinkItems(item: INavbarData): void {
        if (!this.multiple) {
            for (let modelItem of this.navData) {
                if (item !== modelItem && modelItem.expanded) {
                    modelItem.expanded = false;
                }
            }
        }
    }

    private updateMenu(typeUser: string | null): void {
        switch (typeUser) {
            case Role.SystemManager:
                this.navData = navbarDataSystem;
                break;
            case Role.FleetManager:
                this.navData = navbarDataFleet;
                break;
            case Role.CampusManager:
                this.navData = navbarDataCampus;
                break;
            case Role.TaskManager:
                this.navData = navbarDataTask;
                break;
            case Role.User:
                this.navData = navbarDataUser;
                break;
        }
    }
}
