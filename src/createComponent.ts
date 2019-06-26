import { paramCase } from 'change-case';
import { Observable } from 'rxjs';
import { workspace, window } from 'vscode';

import { FileHelper, logger } from './helpers';
import { Config as ConfigInterface } from './config.interface';

export const createComponent = (uri, suffix: string = '') => {
  // Display a dialog to the user
  let enterComponentNameDialog$ = Observable.from(
      window.showInputBox(
          {prompt: 'Please enter component name in camelCase then I can convert it to PascalCase for you.'}
      ));

  enterComponentNameDialog$
      .concatMap( val => {
          if (val.length === 0) {
              logger('error', 'Component name can not be empty!');
              throw new Error('Component name can not be empty!');
          }
          let componentName = paramCase(val);
          let componentDir = FileHelper.createComponentDir(uri, componentName);

          return Observable.forkJoin(
              FileHelper.createComponent(componentDir, componentName, suffix),
              FileHelper.createIndexFile(componentDir, componentName),
              FileHelper.createCSS(componentDir, componentName),
          );
      })
      .concatMap(result => Observable.from(result))
      .filter(path => path.length > 0)
      .first()
      .concatMap(filename => Observable.from(workspace.openTextDocument(filename)))
      .concatMap(textDocument => {
          if (!textDocument) {
              logger('error', 'Could not open file!');
              throw new Error('Could not open file!');
          };
          return Observable.from(window.showTextDocument(textDocument))
      })
      .do(editor => {
          if (!editor) {
              logger('error', 'Could not open file!');
              throw new Error('Could not open file!')
          };
      })
      .subscribe(
          (c) => logger('success', 'React component successfully created!'),
          err => logger('error', err.message)
      );
};