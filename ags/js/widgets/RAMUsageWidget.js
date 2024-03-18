import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const RAMUsageWidget = () => {

    const icon = Widget.Icon({
        icon: 'ramm', // Make sure this is the correct icon name or path
        class_name: 'RAMUsageWidget__icon', // Your custom CSS class for the icon
    });
    
    const label = Widget.Label({
        label: '0%',
        class_name: 'RAMUsageWidget__label', // Your custom CSS class for the label
    });

    const updateCPUUsage = async () => {
        try {
            // Указываем абсолютный путь к скрипту
            const command = `/home/melbine/.dotfiles/ags/scripts/getRAM`;
            const ramUsage = await execAsync(command);
            label.label = `${ramUsage.trim()}%`;
        } catch (error) {
            console.error("Ошибка при получении загрузки CPU:", error);
            label.label = "Ошибка";
        }
    };

    // Обновляем загрузку CPU каждую секунду
    setInterval(updateCPUUsage, 1000);

    return Widget.Box({
        children: [icon, label],
        class_name: 'RAMUsageWidget'
    });
};

export default RAMUsageWidget;
