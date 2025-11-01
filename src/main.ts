import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { DevTools } from './app/dev-tools';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    // Inicializa as ferramentas de desenvolvimento
    DevTools.init(appRef);
  })
  .catch((err) => console.error(err));
