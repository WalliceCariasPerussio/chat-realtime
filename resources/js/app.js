require('./bootstrap');

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';

function csrf_token() {
    const date = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    axios.get(route('csrf-token')).then(response => {
        document.querySelector('meta[name="csrf-token"]').setAttribute('content', response.data.csrfToken);
    });

    return date;
}

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}.vue`),
    setup({ el, app, props, plugin }) {
        return createApp({ render: () => h(app, props) })
            .use(plugin)
            .mixin({ methods: { route,csrf_token } })
            .mount(el);
    },
});

InertiaProgress.init({ color: '#4B5563' });


