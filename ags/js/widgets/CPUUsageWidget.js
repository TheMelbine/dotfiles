import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const CPUUsageWidget = () => {

    const icon = Widget.Icon({
        icon: 'cpy', // Make sure this is the correct icon name or path
        class_name: 'CPUUsageWidget__icon', // Your custom CSS class for the icon
    });
    
    const label = Widget.Label({
        label: '0%',
        class_name: 'CPUUsageWidget__label', // Your custom CSS class for the label
    });

    const updateCPUUsage = async () => {
        try {
            // Указываем абсолютный путь к скрипту
            const command = '/home/melbine/bash.sh';
            const cpuUsage = await execAsync(command);
            // console.log("CPU Usage:", cpuUsage); // Добавим логирование для отладки
            label.label = `${cpuUsage.trim()}%`;
        } catch (error) {
            console.error("Ошибка при получении загрузки CPU:", error);
            label.label = "Ошибка";
        }
    };

    // Обновляем загрузку CPU каждую секунду
    setInterval(updateCPUUsage, 1000);

    return Widget.Box({
        children: [icon, label],
        class_name: 'CPUUsageWidget'
    });
};

export default CPUUsageWidget;
