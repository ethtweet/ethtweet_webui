import moment from 'moment';
// 时间转换工具
const friendlyDate = {
    methods: {
        friendlyDate(time) {
			var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
			if(regPos.test(time))
				time = new Date(time*1000);
			if(moment(time).isValid()){
				// var formats = {
				//     'year': '%n% 年前',
				//     'month': '%n% 月前',
				//     'day': '%n% 天前',
				//     'hour': '%n% 小时前',
				//     'minute': '%n% 分钟前',
				//     'second': '%n% 秒前',
				// };
				var formats = {
				    'year': '%n% Years ago',
				    'month': '%n% Months ago',
				    'day': '%n% Days ago',
				    'hour': '%n% Hours ago',
				    'minute': '%n% Minutes ago',
				    'second': '%n% Seconds ago',
				};
				 var now = Date.now();
				 var timestamp = moment(time).valueOf();
				 if (timestamp.length<11) {
				     timestamp = timestamp*1000
				 }
				 var seconds = Math.floor((now - timestamp) / 1000);
				 var minutes = Math.floor(seconds / 60);
				 var hours = Math.floor(minutes / 60);
				 var days = Math.floor(hours / 24);
				 var months = Math.floor(days / 30);
				 var years = Math.floor(months / 12);

				 var diffType = '';
				 var diffValue = 0;
				 if (years > 0) {
				     diffType = 'year';
				     diffValue = years;
				     return moment(timestamp).format('YYYY-MM-DD');
				 } else {
				     if (months > 0) {
				         diffType = 'month';
				         diffValue = months;
				         return moment(timestamp).format('YYYY-MM-DD');
				     } else {
				         if (days > 0) {
				             diffType = 'day';
				             diffValue = days;
				             return moment(timestamp).format('YYYY-MM-DD');
				         } else {
				             if (hours > 0) {
				                 diffType = 'hour';
				                 diffValue = hours;
				             } else {
				                 if (minutes > 0) {
				                     diffType = 'minute';
				                     diffValue = minutes;
				                 } else {
				                     diffType = 'second';
				                     diffValue = seconds === 0 ? (seconds = 1) : seconds;
				                 }
				             }
				         }
				     }
				 }
				 return formats[diffType].replace('%n%', diffValue);
			} else {
				console.log('无效时间');
				return ''
			}
            
        }
    }
}

const h5Copy = {
	methods: {
		h5Copy(content) {
		  if (!document.queryCommandSupported('copy')) {
		    // 不支持
		    return false
		  }
		  
		  let textarea = document.createElement("textarea")
		  textarea.value = content
		  textarea.readOnly = "readOnly"
		  document.body.appendChild(textarea)
		  textarea.select() // 选择对象
		  textarea.setSelectionRange(0, content.length) //核心
		  let result = document.execCommand("copy") // 执行浏览器复制命令
		  textarea.remove()
		  return result
		  
		}
	}
}

export {
    friendlyDate,
	h5Copy
}