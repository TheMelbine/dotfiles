
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

import Gtk from 'gi://Gtk?version=3.0';

Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets`);



const Clock = () => Widget.Label({
    class_name: 'clock',
    setup: self => self
        .poll(1000, self => execAsync(['date', '+%A | %d %B | %H:%M:%S'])
            .then(date => self.label = date)),
});

export default Clock