import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';

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

export default SysTray