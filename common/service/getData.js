import fetch from './fetch'

export const newsList = (dataObj) => fetch('/api/news', dataObj);

export const getNormalNewsDetail = (id) =>fetch('/api/news/36kr/'+id);