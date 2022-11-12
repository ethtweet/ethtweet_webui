const baseUrl = 'https://unidemo.dcloud.net.cn';

export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	type = type.toUpperCase();
	url = baseUrl + url;

	return new Promise((resolve, reject) => {
		let requestObj;
		
		uni.request({
			url,
			method: type,
			data,
			success: (result) => {
				resolve(result);
			},
			fail: (err) => {
				reject(err)
			},
			complete: (e) => {
				resolve(e,'complete');
			}
		});
	})

}