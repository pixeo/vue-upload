import axios from 'axios';

const defaultOptions = {
    url: null,
    multiple: false,
    accept: '',
    onBeforeProcessing: () => {},
    onBeforeSend: () => {},
    onSuccess: () => {},
};

class Upload {
    constructor(Vue, options = {}) {
        this.options = Object.assign(defaultOptions, options);

        this.store = new Vue({
            data() {
                return {
                    uploaders: {},
                };
            },
        });
    }

    static id(name) {
        return `upload-${name}`;
    }

    static input(name) {
        return document.getElementById(Upload.id(name));
    }

    static createInput(name, options, onChange) {
        const input = document.createElement('input');
        input.type = 'file';
        input.id = Upload.id(name);
        input.style.display = 'none';
        input.onchange = onChange;
        input.setAttribute('accept', options.accept);

        document.body.appendChild(input);
    }

    uploader(name) {
        return this.store.uploaders[name];
    }

    files(name) {
        const uploader = this.uploader(name);

        return uploader ? uploader.files : [];
    }

    create(name, options = {}) {
        if (this.uploader(name)) {
            return;
        }

        this.store.$set(this.store.uploaders, name, {
            options: Object.assign({}, this.options, options),
        });

        Upload.createInput(name, this.uploader(name).options, (event) => {
            this.processFiles(event, name);
        });

        if (this.uploader(name).options.multiple) {
            Upload.input(name).multiple = true;
        }

        this.reset(name, options);
    }

    reset(name, options = {}) {
        const uploader = this.uploader(name);

        this.store.$set(uploader, 'options', Object.assign({}, uploader.options, options));
        this.store.$set(uploader, 'files', []);

        Upload.input(name).value = null;
    }

    destroy(name) {
        const input = Upload.input(name);

        input.parentNode.removeChild(input);

        delete this.store.uploaders[name];
    }

    remove(name, file) {
        const { files } = this.uploader(name);

        const indexOf = files.indexOf(file);

        if (indexOf > -1) {
            files.splice(indexOf, 1);
        }
    }

    select(name) { // eslint-disable-line
        Upload.input(name).click();
    }

    processFiles(event, name) {
        const uploader = this.uploader(name);
        const { target: { files: selectedFiles } } = event;

        if (selectedFiles.length === 0) {
            return;
        }

        uploader.options.onBeforeProcessing(event, name, selectedFiles);

        for (let i = 0; i < selectedFiles.length; i += 1) {
            const file = Object.assign({
                $file: selectedFiles[i],
                name: selectedFiles[i].name,
                size: selectedFiles[i].size,
                type: selectedFiles[i].type,
                src: null,
            }, selectedFiles[i]);

            uploader.files.push(file);

            this.preview(file);
        }

        uploader.files
            .filter(file => file.status !== 'success')
            .forEach((file) => {
                const fileUploadFormData = new FormData();

                uploader.options.onBeforeSend(fileUploadFormData);

                fileUploadFormData.append('file', file.$file);

                this.store.$set(file, 'status', 'sending');

                axios({
                    method: 'post',
                    url: uploader.options.url,
                    data: fileUploadFormData,
                })
                    .then(({ data }) => {
                        uploader.options.onSuccess(file, data);

                        this.store.$set(file, 'status', 'success');

                        Upload.input(name).value = null;
                    }).catch(() => {
                        this.store.$set(file, 'status', 'error');
                    });
            });
    }

    preview(file) {
        const reader = new window.FileReader();

        reader.onload = (event) => {
            this.store.$set(file, 'src', event.target.result);
        };

        return reader.readAsDataURL(file.$file);
    }
}

export default Upload;
