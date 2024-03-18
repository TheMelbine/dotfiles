import { execAsync } from "resource:///com/github/Aylur/ags/utils/exec.js";

const CPUTempratureWidget = () => {

    const icon = Widget.Icon({
        icon: 'tempp',
        class_name: 'CPUTempratureWidget__icon'
    });

    const label = Widget.Label({
        label: '0°C',
        class_name: 'CPUTempratureWidget__label'
    });


    const updateCPUTemperature = async () => {
        try {
            const script = '/home/melbine/.dotfiles/ags/scripts/getTempCPU'
            const cpuTemp = await execAsync(script)

            label.label = `${cpuTemp}°C`;
        } catch (error) {
            console.error('Ошибка при получении температуры CPU')
            label.label = 'Ошибка'
        }
    };

    setInterval(updateCPUTemperature, 1000);

    return Widget.Box({
        children: [icon, label],
        class_name: 'CPUTempratureWidget'
    })

}

export default CPUTempratureWidget;