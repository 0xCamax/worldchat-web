export function cn(...args: any[]) {
  // Implementación de la función cn (puedes usar la biblioteca 'classnames' aquí)
  let classes = '';
    for (let arg of args) {
        if (typeof arg === 'string' && arg) {
            classes += ' ' + arg;
        } else if (typeof arg === 'object' && arg !== null) {
            for (let key in arg) {
                if (arg[key]) {
                    classes += ' ' + key;
                }
            }
        }
    }
    return classes.trim();
}