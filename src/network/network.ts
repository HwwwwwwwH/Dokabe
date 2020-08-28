import axios from 'axios'

const instance = axios.create({
	baseURL: 'http://simplebbs.iterator-traits.com'
});

instance.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;
