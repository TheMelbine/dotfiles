import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const RAMUsageWidget = () => {

    const icon = Widget.Icon({
        icon: 'ramm', 
        class_name: 'RAMUsageWidget__icon', 
    });
    
    const label = Widget.Label({
        label: '0%',
        class_name: 'RAMUsageWidget__label',
    });

    const updateCPUUsage = async () => {
        try {
            const command = `/home/melbine/.dotfiles/ags/scripts/getRAM`;
            const ramUsage = await execAsync(command);
            label.label = `${ramUsage.trim()}%`;
        } catch (error) {
            console.error("Ошибка при получении загрузки CPU:", error);
            label.label = "Ошибка";
        }
    };

    setInterval(updateCPUUsage, 1000);

    return Widget.Box({
        children: [icon, label],
        class_name: 'RAMUsageWidget'
    });
};

export default RAMUsageWidget;
