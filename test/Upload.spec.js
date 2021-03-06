/* eslint-env mocha */
import { createLocalVue } from '@vue/test-utils';
import expect from 'expect';
import moxios from 'moxios';
import Upload from '../src/Upload';

const uploadFactory = () => new Upload(createLocalVue(), {
    url: 'http://localhost',
});

describe('Upload', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('can create the upload class', () => {
        const upload = uploadFactory();

        expect(upload.options.url).toBe('http://localhost');
    });

    it('can create a file input', () => {
        const upload = uploadFactory();

        upload.create('default');

        const elem = document.querySelector('#upload-default');
        expect(elem).toBeInstanceOf(HTMLInputElement);
        expect(elem.id).toBe('upload-default');
        expect(upload.files('default')).toEqual([]);
    });

    it('can upload files', (done) => {
        moxios.stubRequest('http://localhost', {
            status: 200,
            response: {},
        });

        const upload = uploadFactory();

        upload.create('default');

        upload.processFiles({
            target: {
                files: [
                    new File(['test'], 'test.jpg'),
                ],
            },
        }, 'default');

        moxios.wait(() => {
            expect(upload.files('default').length).toBe(1);
            expect(upload.files('default')[0].name).toBe('test.jpg');
            expect(upload.files('default')[0].size).toBe(4);
            expect(upload.files('default')[0].status).toBe('success');

            done();
        });
    });

    it('can remove a file from the file array', () => {
        const upload = uploadFactory();
        upload.create('default');
        upload.store.$set(
            upload.store.uploaders.default,
            'files',
            ['test-a', 'test-b'],
        );

        expect(upload.files('default').length).toBe(2);

        upload.remove('default', 'test-a');

        expect(upload.files('default').length).toBe(1);
    });

    it('can set input\'s accept parameter', () => {
        const uploader = new Upload(createLocalVue());

        uploader.create('default-1', {
            url: 'http://localhost',
            accept: 'image/png',
        });

        const elem = document.querySelector('#upload-default-1');
        expect(uploader.uploader('default-1').options.url).toBe('http://localhost');
        expect(elem.getAttribute('accept')).toBe('image/png');
    });

    it('can destroy an instance', () => {
        const uploader = new Upload(createLocalVue());

        uploader.create('removed');
        uploader.store.$set(
            uploader.store.uploaders.removed,
            'files',
            ['test-a', 'test-b'],
        );


        let elem = document.querySelector('#upload-removed');
        expect(elem).toBeInstanceOf(HTMLInputElement);
        expect(elem.id).toBe('upload-removed');

        uploader.destroy('removed');

        elem = document.querySelector('#upload-removed');
        expect(elem).toBeNull();
        console.log(uploader.store.uploaders.removed);
        expect(uploader.store.uploaders.removed).toBeUndefined();
    });
});
