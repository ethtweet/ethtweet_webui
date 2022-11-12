# 一款简单的图片预览

### 使用方式	
页面使用需在 ``` script ``` 中引用组件
``` javascript
import hxPreviewImg from "@/components/hx-preview-img/hx-preview-img.vue";
export default {
    components: {hxPreviewImg}
}
```

全局使用需在 ``` main.js ```  中注册组件
``` javascript
import hxPreviewImg from "@/components/hx-preview-img/hx-preview-img.vue";
Vue.component('hx-preview-img',hxPreviewImg)

```


### 属性
 
| 名称                        | 类型            | 默认值                | 描述                                               |
| ----------------------------|--------------- | ---------------------- | ---------------------------------------------------|
| current                   | String         | -       		   | 当前要预览的图片	src											|
| list						| Array			  | []               | 图片数组```['img1.png','img2.png','img3.png','img4.png'] ```|
| start   				    | Number         | 0             | 每次需要预览时需要更改该数值，每次+1即可  |

### 使用例子

``` html

<hx-preview-img :list.sync="previewImgList" :current.sync="currentImg" :start.sync="PINum"></hx-preview-img>

<button @click="previewImg(imgList[2],imgList)"></button>
button	
```
``` javascript
data:{
	currentImg: '',
	previewImgList: [],
	PINum: 0,
	
	imgList: ['img1.png','img2.png','img3.png','img4.png']
}
methods:{
	//图片预览
	previewImg(imgSrc,list){
		this.currentImg = imgSrc
		this.previewImgList = list
		this.PINum++
	},
}
```


#### 为方便交流，我创建了一个QQ群 954035921，有什么问题可以加群讨论

