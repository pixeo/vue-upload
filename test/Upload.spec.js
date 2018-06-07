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
            expect(upload.files('default')[0].src).toBe('data:;base64,dGVzdA==');

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
});
