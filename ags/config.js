import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, execAsync, monitorFile } from 'resource:///com/github/Aylur/ags/utils.js';
import Gio from "gi://Gio";
import Gtk from 'gi://Gtk?version=3.0';

Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets`);


const Workspaces = () => Widget.Box({
    class_name: 'workspace',
    children: (() => {
        let defaultName = {
            1: 'I',
            2: 'II',
            3: 'III',
            4: 'IV',
            5: 'V',
        };
        
        let workspaceButtons = [];
        for (let id = 1; id <= 5; id++) {
            let workspaceValue = defaultName[id]; // Получаем значение из объекта defaultName
            workspaceButtons.push(
                Widget.Button({
                    on_clicked: () => Hyprland.message(`dispatch workspace ${id}`),
                    child: Widget.Label(workspaceValue),
                    cursor: 'pointer',
                    class_name: Hyprland.active.workspace.bind('id')
                        .transform(i => `${i === id ? 'workspace__item_focused' : ''} workspace__item`),
                })
            );
        }
        return workspaceButtons;
    })(),
});
const ClientTitle = () => Widget.Label({
    class_name: 'client-title',
    label: Hyprland.active.client.bind('class'),
});

const Clock = () => Widget.Label({
    class_name: 'clock',
    setup: self => self
        // this is bad practice, since exec() will block the main event loop
        // in the case of a simple date its not really a problem
        .poll(1000, self => self.label = exec('date "+%H:%M:%S"'))

        // this is what you should do
        .poll(1000, self => execAsync(['date', '+%H:%M:%S'])
            .then(date => self.label = date)),
});

// we don't need dunst or any other notification daemon
// because the Notifications module is a notification daemon itself
const Notification = () => Widget.Box({
    class_name: 'notification',
    visible: Notifications.bind('popups').transform(p => p.length > 0),
    children: [
        Widget.Icon({
            icon: 'preferences-system-notifications-symbolic',
        }),
        Widget.Label({
            label: Notifications.bind('popups').transform(p => p[0]?.summary || ''),
        }),
    ],
});

// const Media = () => Widget.Button({
//     class_name: 'media',
//     on_primary_click: () => Mpris.getPlayer('')?.playPause(),
//     on_scroll_up: () => Mpris.getPlayer('')?.next(),
//     on_scroll_down: () => Mpris.getPlayer('')?.previous(),
//     child: Widget.Label('-').hook(Mpris, self => {
//         if (Mpris.players[0]) {
//             const { track_artists, track_title } = Mpris.players[0];
//             self.label = `${track_artists.join(', ')} - ${track_title}`;
//         } else {

//         }
//     }, 'player-changed'),
// });

const Volume = () => Widget.Box({
    class_name: 'volume',
    css: 'min-width: 150px',
    children: [
        Widget.Icon().hook(Audio, self => {
            if (!Audio.speaker)
                return;

            const category = {
                101: 'overamplified',
                67: 'high',
                34: 'medium',
                1: 'low',
                0: 'muted',
            };

            const icon = Audio.speaker.is_muted ? 0 : [101, 67, 34, 1, 0].find(
                threshold => threshold <= Audio.speaker.volume * 100);

            self.icon = `audio-volume-${category[icon]}-symbolic`;
        }, 'speaker-changed'),
        Widget.Slider({
            class_name: 'volume__slider',
            hexpand: true,
            draw_value: false,
            on_change: ({ value }) => Audio.speaker.volume = value,
            setup: self => self.hook(Audio, () => {
                self.value = Audio.speaker?.volume || 0;
            }, 'speaker-changed'),
        }),
    ],
});



const SysTray = () => Widget.Box({
    class_name: 'systemTray',

    children: SystemTray.bind('items').transform(items => {
        return items.map(item => Widget.Button({
            class_name: 'systemTray__item',
            child: Widget.Icon().bind('icon', item, 'icon'),
            on_primary_click: (_, event) => item.activate(event),
            on_secondary_click: (_, event) => item.openMenu(event),
            tooltip_markup: item.bind('tooltip_markup'),
        }));
    }),
});

// layout of the bar


const Weather = () => Widget.Box({
    class_name: 'weather',
    setup: self => {
        const apiKey = 'f27592c94b6543a0823173128241302';
        const location = 'Voronezh';
        let prevTemp = null;
        let prevIconName = null;
        
        const fetchWeather = () => {
            const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no&lang=ru`;
            execAsync(['curl', '-s', url])
                .then(response => JSON.parse(response))
                .then(data => {
                    const temp = Math.round(data.current.temp_c);
                    const condition = data.current.condition.text;
                    const isDay = data.current.is_day;
                    const iconCode = data.current.condition.icon.match(/\/(\d+)\.png$/)[1];
                    const iconName = `${iconCode}-${isDay ? 'day' : 'night'}`;


                    if (temp !== prevTemp || iconName !== prevIconName) {

                        self.tooltip_text = `${condition}`;
                        self.children = [
                            Widget.Icon({
                                icon: iconName,
                                class_name: 'weather__icon'
                            }),
                            Widget.Label({
                                class_name: 'weather__label',
                                label: `${temp}°C`
                            }),
                            
                        ];
                        
                        prevTemp = temp;
                        prevIconName = iconName;
                    }
                })
                .catch(error => console.error('Weather widget error:', error));
        };

        fetchWeather();
        const intervalId = setInterval(fetchWeather, 10000);
        self.onDestroy = () => {
            clearInterval(intervalId);
        };
    },
});

const Left = () => Widget.Box({

    spacing: 8,
    children: [
        ClientTitle(),

    ],
});


const Center = () => Widget.Box({
    spacing: 8,
    children: [
        
        Workspaces(),
    ],
});

const Right = () => Widget.Box({
    hpack: 'end',
    // spacing: 8,
    children: [
        Weather(),
        Volume(),
        Clock(),
        SysTray()
    ],
});



const applyCss = () => {

    exec( `sass ${App.configDir}/style/main.scss ${App.configDir}/style.css`)
    console.log("Scss compiled");

    App.resetCss();
    App.applyCss(`${App.configDir}/style.css`);
    console.log(`Compiled css applied into ${App.configDir}/style.css`);

}

monitorFile(`${App.configDir}/style`, () => {
        applyCss()    
  });









const Bar = (monitor = 0) => Widget.Window({
    // css: 'min-height: 20px',
    name: `bar-${monitor}`, // name has to be unique
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



// exporting the config so ags can manage the windows
export default {
    icons: `${App.configDir}/assets`,
    style: `${App.configDir}/style.css`,
    windows: [
        Bar(),
    ],
};
