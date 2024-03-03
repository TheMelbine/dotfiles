import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { exec, execAsync, monitorFile } from 'resource:///com/github/Aylur/ags/utils.js';

const Workspaces = () => Widget.Box({
    class_name: 'workspace',
    children: (() => {
        let defaultWorkspaces = {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
        };
        
        let workspaceButtons = [];
        for (let id = 1; id <= 5; id++) {
            let workspaceValue = defaultWorkspaces[id]; // Получаем значение из объекта defaultName
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


export default Workspaces