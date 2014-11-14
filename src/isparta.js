import * as istanbul from 'istanbul';

for (var key in istanbul) {
	if (istanbul.hasOwnProperty(key)) {
		exports[key] = istanbul[key];
	}
}

export {Instrumenter} from './instrumenter';
export {version} from '../package.json';
