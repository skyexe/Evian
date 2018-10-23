import debugConf from './debug'
import prodConf from './prod'

const debug = process.env.NODE_ENV !== 'production'
const exportValue = debug ? debugConf : prodConf;

export default exportValue;
