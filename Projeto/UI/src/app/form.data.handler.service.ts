import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormDataHandlerService {

    constructor() { }
  
    loadSavedData(itemName: string, item: any): any {
        // Carrega dados do LocalStorage ao iniciar o componente
        const storedData = localStorage.getItem(itemName);
        if (storedData !== undefined && storedData !== null) {
            item = JSON.parse(storedData);
        }

        return item;
    }

    saveData(itemName: string, item: any) {
        // Guarda os dados no LocalStorage
        localStorage.setItem(itemName, JSON.stringify(item));
    }

    destroySavedData(itemName: string) {
        localStorage.removeItem(itemName);
    }
}
