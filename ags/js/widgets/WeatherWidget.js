import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Gtk from 'gi://Gtk?version=3.0';
Gtk.IconTheme.get_default().append_search_path(`${App.configDir}/assets`);

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

export default Weather