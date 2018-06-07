/* eslint-env mocha */
import { createLocalVue } from '@vue/test-utils';
import expect from 'expect';
import Installer from '../src/index';
import Upload from '../src/Upload';

const Vue = createLocalVue();
Vue.use(Installer);

describe('Install', () => {
    it('exposes the $upload variable', () => {
        const app = new Vue();
        expect(app.$upload).toBeInstanceOf(Upload);
    });
});
