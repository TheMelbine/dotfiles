import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import KeyboardLayoutWidget from './KeyboardLayoutWidget.js';
import Clock from './ClockWidget.js';
import Weather from './WeatherWidget.js';
import Volume from './VolumeWidget.js';
import SysTray from './SysTrayWidget.js';

const Left = () => Widget.Box({
    children: [],
});

const Center = () => Widget.Box({
    children: [Clock()],
});

const Right = () => Widget.Box({
    children: [KeyboardLayoutWidget(), Weather(), Volume(), SysTray()],
});

const Bar = (monitor = 0) => Widget.Window({
    name: `bar-${monitor}`,
    class_name: 'bar',
    monitor,
    child: Widget.CenterBox({
        start_widget: Left(),
        center_widget: Center(),
        end_widget: Right(),
    }),
});

export default Bar;
