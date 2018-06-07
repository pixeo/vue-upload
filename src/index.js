import Upload from './Upload';

export default {
    install(Vue, options) {
        const upload = new Upload(Vue, options);

        Object.defineProperties(Vue.prototype, {
            $upload: {
                get: function () { // eslint-disable-line
                    return upload;
                },
            },
        });
    },
};
