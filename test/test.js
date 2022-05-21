const Axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
(async () => {
	try {
		let res = await Axios.post('http://localhost:10750/translate', {
			text: 'Hello world, this is a test of the translation cache system.',
			sourceLanguage: 'en',
			targetLanguage: 'pl'
		}, {
			headers: {
				'Authorization': process.env.NEURALSPACE_AUTH_TOKEN
			}
		});
		console.log(res.data);
	} catch (err) {
		console.log(err);
	}
})();