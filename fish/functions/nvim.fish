function nvim --description 'Запуск nvim с изменением padding в Kitty'
    kitty @ set-spacing padding=0
    command nvim $argv
    kitty @ set-spacing padding=10
end

