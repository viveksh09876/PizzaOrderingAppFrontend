import { Component, OnInit } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';
import { DataService } from '../data.service';
import { MessageComponent } from '../message/message.component';

declare var jQuery: any;

@Component({
  selector: 'app-favmodal',
  templateUrl: './favmodal.component.html',
  styleUrls: ['./favmodal.component.css']
})
export class FavmodalComponent extends DialogComponent<FavModal, null> {
  
  constructor(dialogService: DialogService, private dataService: DataService) {
    super(dialogService);
   }

   item = this.item;
   favTitle = '';
   showSaving = false;
  
  saveFav() {
      this.showSaving = true;
      let userDetails = JSON.parse(this.dataService.getLocalStorageData('user-details'));
      let userId = userDetails.id;
      this.dataService.saveFavItem(userId, this.favTitle, this.item)
        .subscribe(data => {
            this.showSaving = true;
            this.openMessageModal('Your favorite item has been saved successfully!');
            console.log('fav resp', data);
        });  
  }


  openMessageModal(messageText) {
     let self = this;
     self.close();
     self.dialogService.addDialog(MessageComponent, { title: 'Success', message: messageText, buttonText: 'Continue', doReload: false }, { closeByClickingOutside:true });   
  }
 
}

export interface FavModal {
  item: object;
}
