import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

import Gtk from 'gi://Gtk?version=3.0';
Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets`);


const keyboardName = 'gaming-keyboard';

const KeyboardLayoutWidget = () => {
    const layoutLabel = Widget.Label({
        class_name: 'keyboardLayout__label',
        label: '',
    });

    const layoutIcon = Widget.Icon({
        class_name: 'keyboardLayout__icon',
        icon: '',
    });

    return Widget.Box({
        class_name: 'keyboardLayout',
        children: [layoutIcon, layoutLabel],
        setup: self => {
            const updateKeyboardLayout = () => {
                execAsync('hyprctl devices -j')
                    .then(output => {
                        const { keyboards } = JSON.parse(output);
                        const gamingKeyboard = keyboards.find(keyboard => keyboard.name === keyboardName);
                        if (gamingKeyboard) {
                            const activeLayout = gamingKeyboard.active_keymap;
                            switch (activeLayout) {
                                case 'Russian':
                                    layoutLabel.label = 'RU';
                                    layoutIcon.icon = 'RU'; 
                                    break;
                                case 'English (US)':
                                    layoutLabel.label = 'US';
                                    layoutIcon.icon = 'USA'; 
                                    break;
                                default:
                                    layoutLabel.label = 'Unknown layout';
                                    layoutIcon.icon = '';
                            }
                        } else {
                            layoutLabel.label = 'Gaming keyboard not found';
                            layoutIcon.icon = '';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching keyboard layout:', error);
                        layoutLabel.label = 'Failed to fetch keyboard layout';
                        layoutIcon.icon = '';
                    });
            };

            updateKeyboardLayout();

            const intervalId = setInterval(updateKeyboardLayout, 100);

            self.onDestroy = () => clearInterval(intervalId);
        },
    });
};

export default KeyboardLayoutWidget