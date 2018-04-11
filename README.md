# Editor

一款富文本编辑器请查收~~  

依赖于 font-awesome

## 用法
### 引用：
```
<div id="editor">       
    
</div>


impot ~~~~

let editor = new Editor("#editor", {
            width: 900,
            height: 650,
            hiddenModules: [],
        });
        
        
暴露两个方法   editor.getHtml()   and    editor.getText()
```
模块有: 1、heading(标题)
       2、font(字体和字号)
       3、bold(加粗)
       4、italic(斜体)
       5、underline(下划线)
       6、strikeThrough(删除线)
       7、fontColor(字体颜色)
       8、fontBackground(背景色)
       9、alignLeft(居左)
       10、alignCenter(居中)
       11、alignRight(居右)
       12、alignJustify(两端对齐)
       13、listOL(有序列表)
       14、listUL(无序列表)
       15、indent(缩进)
       16、outdent(取消缩进)
       17、table(插入表格)
       18、link(插入链接)
       19、unLink(断开链接)
       20、image(插入图片)    待优化 上传到云服务器
       21、video(插入视频)    待处理 上传到云服务器
       22、audio(插入音频)    待处理 上传到云服务器
       23、emotion(表情)     待优化
       24、fullScreen(全屏)
       25、save(保存)       
       
       
	
参数：  
width：编辑器的宽  
height：编辑器的高  
hiddenModules：隐藏模块(如果觉得多的话 )

文档尚为优化

todo: 1、文档优化
      2、图片 音频 视频 上传到服务器
      3、用vue撸一个

