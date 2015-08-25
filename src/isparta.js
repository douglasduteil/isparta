import * as istanbul from 'istanbul';
import { Instrumenter } from './instrumenter';
import { version } from '../package.json';

for (var key in istanbul) {
	if (istanbul.hasOwnProperty(key)) {
		exports[key] = istanbul[key];
	}
}

exports.Instrumenter = Instrumenter;
exports.version = version;
