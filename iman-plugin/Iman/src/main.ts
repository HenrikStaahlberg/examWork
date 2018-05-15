import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ImanCommunicator } from './app/iman/iman-communicator';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Setting up the communicator 
const c = new ImanCommunicator();
(<any>window).communicator = c;

// Adds app-root to html
var x = document.createElement("app-root");                                 
document.body.appendChild(x);   

// Adds font icon ref
var fontIcons = document.createElement("link");
fontIcons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
fontIcons.rel = "stylesheet";
document.head.appendChild(fontIcons);

var syntaxMarkdown = document.createElement("link");
syntaxMarkdown.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism.min.css";
syntaxMarkdown.rel = "stylesheet" ;
document.head.appendChild(syntaxMarkdown);


// Add manual startbutton to startpage
window.onload = function(){
  console.log("Window load");

  if(window.location.pathname === '/Start'){
    var manualButton = document.createElement("button");
    manualButton.innerHTML = 'Starta manual';
    manualButton.onclick = function() {
      (<any>window).communicator.set("START", "");
      return false;
    };
    document.getElementById("ctl00_cphMainContent_quickStartLinkHelp").appendChild(manualButton);
  }
};
