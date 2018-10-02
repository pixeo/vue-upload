# Vue upload plugin

[![Build Status](https://travis-ci.org/pixeo/vue-upload.svg?branch=master)](https://travis-ci.org/pixeo/vue-upload)

Simple upload plugin for Vue.js.

Inspiration is taken from [this repository](https://github.com/websanova/vue-upload)

## Installation

You can install the package via npm:

```bash
npm install @pixeoweb/upload
```

Next, you must register the plugin. The most common use case is to do that globally.

```js
// in your app.js or similar file
import Vue from 'vue';
import Upload from '@pixeoweb/upload';

Vue.use(Upload);
```

## Usage

```html
<div>
    <button @click="add">Upload files</button>
    <div v-for="file in $upload.files('media')">
        <img src="file.src" />
    </div>
</div>
```

```js
mounted() {
    this.$upload.create('media', {
        url: null,
        multiple: false,
        accept: '',
        onBeforeProcessing: (event, name, selectedFiles) => {},
        onBeforeSend: (fileUploadFormData) => {},
        onSuccess: () => {},
    });
},

methods: {
    add() {
        this.$upload.select('media');
    },
},
```

### Options

**url** - String

**multiple** - Boolean

Allow multiple files to be uploaded.

**accept** - String

The default implementation of `accept` checks the file's mime type or extension against this list.
This is a comma separated list of mime types or file extensions.

Eg.: `image/*,application/pdf,.psd`

**onBeforeProcessing** - Function

This function is triggered before the processing before files are processed.
The function parameters are `event`, `name` and `selectedFiles`

**onBeforeSend** - Function

This function is triggered for each file that is sent to the server.
Gets the formData object as parameters, so you can modify them or add additional data.

**onSuccess** - Function

This function is triggered when the data is successfully sent to the server.
Gets the `file` and `data` as parameters.

### Testing

```bash
npm test
```
