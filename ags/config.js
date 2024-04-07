import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, monitorFile } from 'resource:///com/github/Aylur/ags/utils.js';
import Gtk from 'gi://Gtk?version=3.0';

import CPUTempratureWidget from './js/widgets/CPUTemperatureWidget.js';
import KeyboardLayoutWidget from './js/widgets/KeyboardLayoutWidget.js'
import Workspaces from './js/widgets/WidgetWorkspacesWidget.js'
import SysTray from './js/widgets/SystemTrayWidget.js'
import Weather from './js/widgets/WeatherWidget.js'
import Volume from './js/widgets/VolumeWidget.js'
import Clock from './js/widgets/ClockWidget.js'
import CPUUsageWidget from './js/widgets/CPUUsageWidget.js'
import RAMUsageWidget from './js/widgets/RAMUsageWidget.js'

const applyCss = () => {

    exec( `sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`)
    console.log("Scss compiled");

    App.resetCss();
    App.applyCss(`${App.configDir}/style.css`);
    console.log(`Compiled css applied into ${App.configDir}/style.css`);

}

monitorFile(`${App.configDir}/scss`, () => {
        applyCss()    
  });
  monitorFile(`${App.configDir}/scss/base`, () => {
    applyCss()    
});
monitorFile(`${App.configDir}/scss/components`, () => {
    applyCss()    
});

  const Left = () => Widget.Box({

    spacing: 8,
    children: [
        Workspaces(),

    ],
});

const Center = () => Widget.Box({
    spacing: 8,
    children: [
        CPUTempratureWidget(),
        RAMUsageWidget(),
        CPUUsageWidget(),
        
    ],
});

const Right = () => Widget.Box({
    hpack: 'end',
    children: [
        KeyboardLayoutWidget(),
        Weather(),
        Clock(),
        Volume(),
        SysTray()
    ],
});

const Bar = (monitor = 0) => Widget.Window({
    name: `bar-${monitor}`, 
    class_name: 'bar',
    monitor,
    cursor: 'default',
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        start_widget: Left(),
        center_widget: Center(),
        end_widget: Right(),
    }),
});

export default {
    icons: `${App.configDir}/assets`,
    style: `${App.configDir}/style.css`,
    windows: [
        Bar(),
    ],
};
