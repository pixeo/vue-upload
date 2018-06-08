# Vue upload plugin

[![Build Status](https://travis-ci.org/pixeo/upload.svg?branch=master)](https://travis-ci.org/pixeo/upload)

Simple upload plugin for Vue.js.

Inspiration is taken from [this repository](https://github.com/websanova/vue-upload)

## Installation

You can install the package via npm:

```bash
npm install @pixeoweb/upload
```

Next, you must register the plugin. The most common use case is to do that globally.

```js
//in your app.js or similar file
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
        url: "YOUR_URL", // required
        onBeforeSend: (formData) => {} // optional
        onSuccess: (file, data) => {} // optional
    });
},

methods: {
    add() {
        this.$upload.select('media');
    },
},
```

### Testing

```bash
npm test
```