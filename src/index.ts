import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';
import { ExtensionWidget } from './ExtensionWidget';

/**
 * Activate the APOD widget.
 */
async function activate(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer
) {
  console.log('JupyterLab extension myextension is activated!');

  // Declare a widget variable
  let widget: MainAreaWidget<ExtensionWidget>;

  // command assignment

  const command = 'apod:open';

  app.commands.addCommand(command, {
    label: 'Random Astronomy Picture',
    execute: () => {
      if (!widget) {
        // create widget if none exist
        // const content = new APODWidget();
        const content = new ExtensionWidget();
        widget = new MainAreaWidget({ content });

        widget.id = 'myextension';
        widget.title.label = 'Astronomy Picture';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // add widget to tracker to restore on refresh
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.add(widget, 'main');
      }

      // Refresh the picture in widget
      widget.content.update();
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // track and restore the widget state
  const tracker = new WidgetTracker<MainAreaWidget<ExtensionWidget>>({
    namespace: 'myextension'
  });

  restorer.restore(tracker, {
    command,
    name: () => 'myextension'
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Tutorial' });
}

/**
 * Initialization data for the myextension extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'myextension',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate
};

export default extension;
