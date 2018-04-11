import './style/index.css';

import utils from './utils';

function Editor(...options) {
    //兼容不写new 的情况
    if (!(this instanceof Editor)) return new Editor(options);
    console.log('Editor');

    this.init(options);
}

Editor.prototype = {
    init(options){
        console.log(options);
        if (!options || !options[0] || !utils.isObject(options[1])) return new Error('this argument is wrong');

        console.log(utils.$(options[0]));
        if (!utils.$(options[0])) return new Error('can not get this Dom');

        this.ele = utils.$(options[0]);

        this.defaultConfigOptions = {
            width: 900,
            height: 600,
            toolBg: '#eee',
            iconColor: '#555',
            hiddenModules: [],
            visibleModules: {},
        };

        this.configOptions = Object.assign(this.defaultConfigOptions, options[1]);

        this.openImageLayerBool = true;

        const self = this;
        this.modules = {
            heading: {
                name: 'heading',
                i18n: '标题',
                icon: 'fa fa-header',
                click(i){
                    self.closeModal();

                    let modalHtml = `<div class="st-editor-modal-heading js-st-editor-modal-heading" style="width: 100px;">`;
                    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((item) => {
                        modalHtml += `<${item}>${item}</${item}>`;
                    });
                    modalHtml += `</div>`;

                    self.createModal(modalHtml, `${i <= 15 ? '45' : '85'}`, `${i <= 15 ? `${i* 20}` : `${(i - 15)* 20}`}`,() => {
                        utils.addEvent(utils.$('.js-st-editor-modal-heading'), 'click', (event) =>{
                            //插入h1~~
                            self.execCommand('formatBlock', `<${event.target.tagName.toLowerCase()}>`);
                        });
                    });
                },
            },
            font: {
                name: 'font',
                i18n: '字体',
                icon: 'fa fa-font',
                click(i){
                    self.closeModal();

                    let fontFamily = ['Microsoft YaHei',
                            'Helvetica Neue',
                            'Helvetica',
                            'Arial',
                            'sans-serif',
                            'Verdana',
                            'Georgia',
                            'Times New Roman',
                            'Trebuchet MS',
                            'Microsoft JhengHei',
                            'Courier New',
                            'Impact',
                            'Comic Sans MS',
                            'Consolas'],
                        // fontSize = ['12px', '14px', '16px', '18px', '20px', '22px', '24px'],
                        fontSize = ['1','2','3','4','5','6','7'],
                        fontLineHeight = ['1.0', '1.2', '1.5', '1.8', '2.0', '2.5', '3.0'];

                    let modalHtml = `<div class="st-editor-modal-font js-st-editor-modal-font" style="width: ${self.configOptions.width - 20}px; padding: 10px">
                                        <div class="font-family">
                                            <div class="dec">字体</div>
                                            <ul>
                                                ${fontFamily.map((item) => {
                                                    return `<li data-type="${item}">${item}</li>`;
                                                }).join('')}
                                            </ul>
                                        </div>
                                        <div class="font-size">
                                            <div class="dec">字号</div>
                                            <ul>
                                                ${fontSize.map((item) => {
                                                    return `<li data-type="${item}">${item}</li>`;
                                                }).join('')}
                                            </ul>
                                        </div>
                                     </div>`;
                    // <div class="line-height">
                    //         <div class="dec">行高</div>
                    //         <ul>
                    //         ${fontLineHeight.map((item) => {
                    //             return `<li data-type="${item}">${item}</li>`;
                    //                 }).join('')}
                    // </ul>
                    // </div>
                    self.createModal(modalHtml, `${i <= 15 ? '45' : '85'}`, `10`,() => {
                        utils.addEvent(utils.$('.js-st-editor-modal-font'), 'click', (event) =>{
                            //插入字体 字号 行高~~
                            let cls = event.target.parentNode.parentNode.className;
                            let val = event.target.dataset.type;
                            let commandName = cls === 'font-family' ? 'fontName' : (cls === 'font-size' ? 'fontSize' : (cls === 'line-height' ? 'lineHeight' : ''));
                            commandName !== '' && val && self.execCommand(commandName, val);
                            self.closeModal();
                        });
                    });
                },
            },
            bold: {
                name: 'bold',
                i18n: '加粗',
                icon: 'fa fa-bold',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('bold');
                },
            },
            italic: {
                name: 'italic',
                i18n: '斜体',
                icon: 'fa fa-italic',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('italic');
                },
            },
            underline: {
                name: 'underline',
                i18n: '下划线',
                icon: 'fa fa-underline',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('underline');
                },
            },
            strikeThrough: {
                name: 'strikeThrough',
                i18n: '删除线',
                icon: 'fa fa-strikethrough',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('strikethrough');
                },
            },
            fontColor: {
                name: 'fontColor',
                i18n: '字体颜色',
                icon: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1523286263262" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1432" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M470.975 137l-214.462 562.5h102l44.513-131.25h217.949l48.038 131.25h102.002l-214.501-562.5h-85.5zM512 256.55l78.525 233.175h-160.538l82.013-233.212zM212 774.5v112.5h599.999v-112.5h-599.999z" p-id="1433" fill="#2c2c2c"></path></svg>',
                click(i, bg){
                    self.closeModal();

                    let command = bg === 'bg' ? 'hiliteColor' : 'foreColor';

                    let commonColor = ['#ffffff','#ffd7d5','#ffdaa9','#fffed5','#d4fa00','#73fcd6','#a5c8ff','#ffacd5','#ff7faa',
                                        '#d6d6d6','#ffacaa','#ffb995','#fffb00','#73fa79','#00fcff','#78acfe','#d84fa9','#ff4f79',
                                        '#b2b2b2','#d7aba9','#ff6827','#ffda51','#00d100','#00d5ff','#0080ff','#ac39ff','#ff2941',
                                        '#888888','#7a4442','#ff4c00','#ffa900','#3da742','#3daad6','#0052ff','#7a4fd6','#d92142',
                                        '#000000','#7b0c00','#ff4c41','#d6a841','#407600','#007aaa','#021eaa','#797baa','#ab1942'];

                    let modalHtml = `<div class="st-editor-modal-fontColor js-st-editor-modal-fontColor" style="width: 300px; height: 300px">
                                            <div class="taps">
                                                <span data-type="common" class="active">基本色</span><span data-type="more">更多颜色</span>
                                            </div>
                                            <div class="color">
                                                <div class="common">
                                                    <ul>
                                                        ${commonColor.map((item, index) => {
                                                            return `<li title="${item}" data-color="${item}" style="background-color: ${item}"></li>`;
                                                        }).join('')}
                                                    </ul>
                                                </div>
                                                <div class="more" style="display: none;">
                                                    <div class="">${self.addColorBoard()}</div>
                                                </div>
                                            </div>
                                            <div class="footer">
                                                <div class="show js-show-color"></div>
                                                <div class="box">
                                                    <span class="symbol">#</span>
                                                    <span class="input">
                                                        <input type="text" maxlength="6" class="js-input-color" value="ff0000">
                                                    </span>
                                                </div>
                                                <div class="confirm js-confirm-btn">确认</div>
                                            </div>
                                        </div>`;

                    self.createModal(modalHtml, `${i <= 15 ? '45' : '85'}`, `${i <= 15 ? `${i* 50}` : `${(i - 15)* 20}`}`,() => {
                        utils.addEvent(utils.$('.js-st-editor-modal-fontColor .taps'), 'click', (event) =>{
                            let type = event.target.dataset.type;
                            if (type === 'common'){
                                utils.$('.js-st-editor-modal-fontColor .color').firstElementChild.style.display = 'block';
                                utils.$('.js-st-editor-modal-fontColor .color').lastElementChild.style.display = 'none';

                                event.target.classList.add('active');
                                event.target.nextElementSibling.classList.remove('active');
                            }
                            else if (type === 'more') {
                                utils.$('.js-st-editor-modal-fontColor .color').firstElementChild.style.display = 'none';
                                utils.$('.js-st-editor-modal-fontColor .color').lastElementChild.style.display = 'block';

                                event.target.classList.add('active');
                                event.target.previousElementSibling.classList.remove('active');
                            }
                        });

                        utils.addEvent(utils.$('.js-input-color'), 'keyup', (event) => {
                            utils.$('.js-show-color').style.backgroundColor = `#${utils.$('.js-input-color').value}`;
                        });
                        utils.addEvent(utils.$('.js-st-editor-modal-fontColor .js-confirm-btn'), 'click', (event) => {
                            if(utils.$('.js-input-color').value.length === 6 || utils.$('.js-input-color').value.length === 3){
                                self.execCommand(command, event.target.dataset.color);
                                self.closeModal();
                            }
                        });

                        utils.addEvent(utils.$('.js-st-editor-modal-fontColor .common ul'), 'click', (event) =>{
                            event.target.dataset.color && self.execCommand(command, event.target.dataset.color);
                            self.closeModal();
                        });

                        utils.addEvent(utils.$('.js-st-editor-modal-fontColor .common ul'), 'click', (event) =>{
                            event.target.dataset.color && self.execCommand(command, event.target.dataset.color);
                            self.closeModal();
                        });

                        utils.addEvent(utils.$('.js-st-editor-modal-fontColor .more table'), 'click', (event) => {
                            event.target.tagName.toLowerCase() === 'td' && event.target.title && self.execCommand(command, event.target.title);
                            self.closeModal();
                        });
                    });
                },
            },
            fontBackground: {
                name: 'fontBackground',
                i18n: '背景色',
                icon: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1523286765546" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16"><defs><style type="text/css"></style></defs><path d="M260.376 617.741c-9.641 9.362-14.46 22.46-14.46 39.31 0 14.791 5.24 26.861 15.726 36.223 10.479 9.36 24.331 14.037 41.557 14.037 23.961 0 43.705-8.422 59.245-25.27s23.309-37.999 23.309-63.455v-29.77l-72.727 9.827c-25.462 3.373-43.008 9.737-52.65 19.098zM829.005 92.92H190.046c-70.58 0-127.791 57.212-127.791 127.792v575.063c0 70.58 57.212 127.792 127.791 127.792h638.959c70.58 0 127.791-57.212 127.791-127.792V220.711c0.001-70.58-57.212-127.792-127.791-127.792z m-388.78 651.739h-54.472v-48.019h-1.406C362.82 733.52 331.09 751.96 289.16 751.96c-30.146 0-54.1-8.146-71.883-24.433-17.789-16.281-26.677-38.28-26.677-65.985 0-58.024 34.35-91.818 103.051-101.365l92.1-12.919c0-50.727-20.971-76.094-62.9-76.094-37.251 0-71.231 12.543-101.926 37.628V455.72c30.887-19.277 66.547-28.92 106.98-28.92 74.873 0 112.316 39.31 112.316 117.934v199.924z m344.392-39.17c-25.737 30.983-60.044 46.472-102.91 46.472-40.434 0-71.226-17.035-92.382-51.104H588.2v43.8h-55.033V285.004H588.2v202.73h1.125c24.331-40.62 59.902-60.931 106.7-60.931 38.938 0 69.87 13.712 92.803 41.135 22.932 27.425 34.401 64.912 34.401 112.458 0 52.412-12.875 94.111-38.612 125.094z m-103.754-233.2c-26.95 0-49.187 9.642-66.688 28.92-17.5 19.284-26.249 43.807-26.249 73.57v42.12c0 25.085 8.14 46.286 24.428 63.596 16.287 17.322 36.688 25.973 61.212 25.973 29.2 0 52.037-11.227 68.515-33.692 16.466-22.466 24.709-53.533 24.709-93.225 0-32.752-7.68-58.822-23.029-78.202-15.347-19.373-36.318-29.06-62.898-29.06z" fill="" p-id="1776"></path></svg>',
                click(i){
                    self.modules.fontColor.click(i, 'bg');
                },
            },
            // colorPicker: {
            //     name: 'colorPicker',
            //     i18n: '取色器',
            //     icon: 'fa fa-paint-brush',
            //     click(){},
            // },
            alignLeft: {
                name: 'alignLeft',
                i18n: '居左',
                icon: 'fa fa-align-left',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('justifyLeft');
                },
            },
            alignCenter: {
                name: 'alignCenter',
                i18n: '居中',
                icon: 'fa fa-align-center',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('justifyCenter');
                },
            },
            alignRight: {
                name: 'alignRight',
                i18n: '居右',
                icon: 'fa fa-align-right',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('justifyRight');
                },
            },
            alignJustify: {
                name: 'alignJustify',
                i18n: '两端对齐',
                icon: 'fa fa-align-justify',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('justifyFull');
                },
            },
            listOL: {
                name: 'listOL',
                i18n: '有序列表',
                icon: 'fa fa-list-ol',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('insertOrderedList');
                },
            },
            listUL: {
                name: 'listUL',
                i18n: '无序列表',
                icon: 'fa fa-list-ul',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('insertUnorderedList');
                },
            },
            indent: {
                name: 'indent',
                i18n: '缩进',
                icon: 'fa fa-indent',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('indent');
                },
            },
            outdent: {
                name: 'outdent',
                i18n: '取消缩进',
                icon: 'fa fa-outdent',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('outdent');
                },
            },
            table: {
                name: 'table',
                i18n: '插入表格',
                icon: 'fa fa-table',
                click(i){
                    self.closeModal();

                    let modalHtml = `<div class="st-editor-modal-table js-st-editor-modal-table">
                                        <div class="main">
                                            <div class="row">行: <input type="number" value="2" class="js-row-count"></div>
                                            <div class="column">列: <input type="number" value="2" class="js-column-count"></div> 
                                        </div>
                                         <div class="confirm js-confirm-btn">确认</div>
                                     </div>`;

                    self.createModal(modalHtml, `${i <= 15 ? '45' : '80'}`, `${i <= 15 ? `${i* 20}` : `${(i - 15)* 20}`}`,() => {
                        utils.addEvent(utils.$('.js-st-editor-modal-table .js-confirm-btn'), 'click', (event) =>{
                            //插入h1~~
                            self.execCommand('insertHTML', self.insertTable(utils.$('.js-row-count').value, utils.$('.js-column-count').value));
                            self.closeModal();
                        });
                    });
                },
            },
            link: {
                name: 'link',
                i18n: '插入链接',
                icon: 'fa fa-link',
                click(i){
                    self.closeModal();

                    let modalHtml = `<div class="st-editor-modal-link js-st-editor-modal-link">
                                         <input type="text" placeholder="http:// or http://" class="js-link-input">
                                         <div class="confirm js-confirm-btn">确认</div>
                                     </div>`;

                    self.createModal(modalHtml, `${i <= 15 ? '45' : '80'}`, `${i <= 15 ? `${i* 50}` : `${(i - 15)* 40 - 10}`}`,() => {
                        utils.addEvent(utils.$('.js-st-editor-modal-link .js-confirm-btn'), 'click', (event) =>{
                            //插入h1~~
                            utils.isURL(utils.$('.js-link-input').value.trim()) && self.execCommand('insertHTML', `<a href="${utils.$('.js-link-input').value.trim()}" target="_blank">${utils.$('.js-link-input').value.trim()}</a>`);
                            self.closeModal();
                        });
                    });
                },
            },
            unLink: {
                name: 'unLink',
                i18n: '断开链接，要选中哦~',
                icon: 'fa fa-chain-broken',
                click(i){
                    self.closeModal();

                    utils.toggleClass(document.querySelectorAll('.js-st-editor-header li')[i - 1], 'active');

                    self.execCommand('unlink');
                },
            },
            image: {
                name: 'image',
                i18n: '插入图片',
                icon: 'fa fa-file-image-o',
                click(i){
                    self.closeModal();

                    let modalHtml = `<div class="st-editor-modal-image js-st-editor-modal-image">
                                         <div class="sample">图片上传 <input type="file" class="js-image-input" accept="image/jpg,image/jpeg,image/png"></div>
                                     </div>`;

                    self.createModal(modalHtml, `${i <= 15 ? '45' : '80'}`, `${i <= 15 ? `${i* 50}` : `${(i - 15)* 50 - 10}`}`,() => {
                        self.imageInput((data) => {
                            console.log(data);
                            utils.addEvent(utils.$(`.js-st-editor-container img.${data.imageClass}`), 'click', () =>{
                                self.toggleImageLayer(utils.$(`.js-st-editor-container img.${data.imageClass}`));
                            });
                        });
                    });
                },
            },
            video: {
                name: 'video',
                i18n: '插入视频',
                icon: 'fa fa-file-video-o',
                click(i){
                    self.closeModal();

                    let modalHtml = `<div class="st-editor-modal-image js-st-editor-modal-image">
                                         <div class="sample">图片上传 <input type="file" class="js-image-input" accept="image/jpg,image/jpeg,image/png"></div>
                                     </div>`;

                    self.createModal(modalHtml, `${i <= 15 ? '45' : '80'}`, `${i <= 15 ? `${i* 50}` : `${(i - 15)* 50 - 10}`}`,() => {
                        self.imageInput((data) => {
                            console.log('data',data);
                            utils.addEvent(utils.$(`.js-st-editor-container img.${data.imageClass}`), 'click', () =>{
                                // utils.$(`.js-st-editor-container img.${data.imageClass}`).classList.add()
                                // self.toggleImageLayer(utils.$(`.js-st-editor-container img.${data.imageClass}`)
                            });
                        });
                    });
                },
            },
            audio: {
                name: 'audio',
                i18n: '插入音频',
                icon: 'fa fa-file-audio-o',
                click(){},
            },
            emotion: {
                name: 'emotion',
                i18n: '表情',
                icon: 'fa fa-smile-o',
                sprite: ``,
                click(i){
                    self.closeModal();
                    let modalHtml = `<div class="st-editor-modal-emotion js-st-editor-modal-emotion">
                                         <ul>
                                            ${'x'.repeat(99).split('').map((item,index) =>{
                                                return `<li class="emotion-sprite" data-position="${-20 * index}px" style="background-position:0 ${-20 * index}px;"></li>`;       
                                            }).join('')}
                                          </ul>
                                     </div>`;
                    self.createModal(modalHtml, `${i <= 15 ? '45' : '80'}`, `${i <= 15 ? `${i* 50}` : `${(i - 15)* 50}`}`,() => {
                        // utils.addEvent(utils.$('.js-st-editor-modal-emotion ul'), 'click', (event) => {
                        //     event.target.dataset.position && document.execCommand('insertHTML', true,`<span style="width: 20px; height: 20px; background-position: 0 ${event.target.dataset.position}; background-image: url(${self.modules.emotion.sprite}); background-size: 100% auto; display: inline-block"></span>`);
                        //     self.closeModal();
                        // });
                    });
                },
            },
            fullScreen: {
                name: 'fullScreen',
                i18n: '全屏',
                icon: 'fa fa-arrows-alt',
                click(i){
                    self.closeModal();
                    self.toggleFullScreen();
                },
            },
            save: {
                name: 'save',
                i18n: '保存',
                icon: 'fa fa-floppy-o',
                click(i){
                    console.log(self.getHtml());
                },
            },

        };

        //hidden modules
        if (utils.isArray(this.configOptions.hiddenModules)) {
            this.configOptions.hiddenModules.map((item) => {
                if (this.modules[item]) delete this.modules[item];
            });
        }

        this.render().bind();

    },
    render(){
        let mainHtml = `<div class="st-editor js-st-editor" style="width: ${this.configOptions.width}px; height: ${this.configOptions.height}px"><div class="st-editor-header js-st-editor-header" style="height: 80px;"><ul>`;
        Object.entries(this.modules).map((itemArr, index) => {
            mainHtml += `<li title="${itemArr[1].i18n}" data-type="${itemArr[0]}" data-index="${index + 1}">${(itemArr[0] === 'fontColor' || itemArr[0] === 'fontBackground') ? `${itemArr[1].icon}` : `<i class="${itemArr[1].icon}" aria-hidden="true"></i></li>` }`;
        });
        mainHtml += `</ul></div><div class="st-editor-container js-st-editor-container" style="height: 570px" tabindex="1" contenteditable="true" spellcheck="false"></div></div>`;

        this.ele.innerHTML = mainHtml;

        this.editorContainer = utils.$('.js-st-editor-container');

        return this;
    },
    bind(){
        utils.addEvent(window, 'click', (event) => {
            this.isInModal(event);
        });
        utils.addEvent(this.editorContainer, 'focus', () => {
            utils.$('.js-st-editor').classList.add('active');
        });
        utils.addEvent(this.editorContainer, 'blur', () => {
            utils.$('.js-st-editor').classList.remove('active');
        });
        utils.addEvent(this.editorContainer, 'keyup', () => {
            this.selections.saveSelection();
        });
        utils.addEvent(this.editorContainer, 'mouseup', () => {
            this.selections.saveSelection();
        });

        utils.addEvent(utils.$('.js-st-editor-header'), 'click', (event) => {
            let ele = (event.target.tagName.toLowerCase() === 'i' || event.target.tagName.toLowerCase() === 'svg') ? event.target.parentNode : event.target;
            let type= ele.dataset.type, index = ele.dataset.index;

            this.selections.restoreSelection();

            this.modules[type].click(index);

            this.selections.saveSelection();

            event.stopPropagation();
        });
    },
    createModal(html, top, left, fn){
        let modalDiv = document.createElement('div');
        modalDiv.className = `st-editor-modal js-st-editor-modal`;
        modalDiv.style.top = `${top}px`;
        modalDiv.style.left = `${left}px`;
        modalDiv.innerHTML = html;
        utils.$('.js-st-editor').appendChild(modalDiv);
        //天大bug！！！！
        // let modalHtml = `<div class="st-editor-modal js-st-editor-modal" style="top: ${top}px; left: ${left}px">${html}</div>`;
        // utils.$('.js-st-editor').innerHTML += modalHtml;

        fn && fn();
    },
    closeModal(){
        if (utils.$('.js-st-editor-modal') != null){
            utils.$('.js-st-editor-modal').parentNode.removeChild(utils.$('.js-st-editor-modal'));
        }
    },
    isInModal(event){
        if (utils.$('.js-st-editor-modal') != null){
            let node = event.target;
            let isIn = false;
            let modal = utils.$('.js-st-editor-modal');
            while(typeof node !== 'undefined' && node.nodeName != '#document') {
                if(node === modal) {
                    isIn = true;
                    break;
                }
                node = node.parentNode;
            }
            if(!isIn) {
                this.closeModal();
            }
        }
    },
    execCommand(command, param) {
        console.log(command);
        this.selections.restoreSelection();
        utils.$('.js-st-editor-container').focus();
        if(!arguments[1]) {
            param = null;
        }
        document.execCommand(command, false, param);
    },
    selections: {
        selectedRange: null,
        getCurrentRange() {
            if(window.getSelection) {  /*主流的浏览器，包括chrome、Mozilla、Safari*/
                //使用 window.getSelection() 方法获取鼠标划取部分的起始位置和结束位置
                let sel = window.getSelection();
                if(sel.rangeCount > 0){
                    //通过selection对象的getRangeAt方法来获取selection对象的某个Range对象
                    return sel.getRangeAt(0);
                }

            } else if(document.selection) {       /*IE下的处理*/
                let sel = document.selection;
                return sel.createRange();
            }
            return null;
        },
        saveSelection() {
            this.selectedRange = this.getCurrentRange();
        },
        restoreSelection() {
            let selection = window.getSelection();
            if(this.selectedRange) {
                selection.removeAllRanges();
                selection.addRange(this.selectedRange);
            }
        },
    },
    HSVtoRGB (h, s, v) {
        let r, g, b, i, f, p, q, t;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        let hr = Math.floor(r * 255).toString(16);
        let hg = Math.floor(g * 255).toString(16);
        let hb = Math.floor(b * 255).toString(16);
        return `#${hr.length < 2 ? `0${hr}` : `${hr}`}${hg.length < 2 ? `0${hg}` : `${hg}`}${hb.length < 2 ? `0${hb}` : `${hb}`}`;
    },
    addColorBoard(){
        let table = document.createElement('table');
        table.setAttribute('cellpadding', 0);
        table.setAttribute('cellspacing', 0);
        table.setAttribute('unselectable', 'on');
        table.style.border = '1px solid #d9d9d9';
        table.setAttribute('id', 'color-board');
        for(let row = 1; row < 15; ++row) // should be '16' - but last line looks so dark
        {
            let rows = document.createElement('tr');
            for(let col = 0; col < 25; ++col) // last column is grayscale
            {
                let color;
                if(col == 24) {
                    let gray = Math.floor(255 / 13 * (14 - row)).toString(16);
                    let hexg = (gray.length < 2 ? '0' : '') + gray;
                    color = '#' + hexg + hexg + hexg;
                } else {
                    let hue = col / 24;
                    let saturation = row <= 8 ? row / 8 : 1;
                    let value = row > 8 ? (16 - row) / 8 : 1;
                    color = this.HSVtoRGB(hue, saturation, value);
                }
                let td = document.createElement('td');
                td.setAttribute('title', color);
                td.setAttribute('unselectable', 'on');
                td.style.backgroundColor = color;
                td.width = 12;
                td.height = 12;
                rows.appendChild(td);
            }
            table.appendChild(rows);
        }
        let box = document.createElement('div');
        box.appendChild(table);
        return box.innerHTML;
    },
    insertTable(rows, cols){
        if (rows < 2 || rows > 10) return;
        if (cols < 2 || cols > 10) return;
        let table = '<table style="border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 100%; margin-bottom: 0px; border: 1px solid rgb(221, 221, 221); color: rgb(51, 51, 51); font-size: 14px; line-height: 20px; background-color: transparent;"><tbody>';
        for (let i = 0; i < rows; i++) {
            table += '<tr>';
            for (let j = 0; j < cols; j++) {
                table += '<td style="padding: 8px; line-height: 1.42857; vertical-align: top; border: 1px solid rgb(221, 221, 221);">&nbsp;</td>';
            }
            table += '</tr>';
        }
        table += '</tbody></table>';

        console.log(table);
        return table;
    },
    imageInput(callback){
       utils.addEvent(utils.$('.js-image-input'), 'change', (event) => {
           let file = event.target.files[0];
           if (!file) return;

           let fileName = file.name.split('.')[0];
           let imageBase = '';
           let reader = new FileReader();

           reader.onload = (event) => {
               imageBase = event.target.result;
               this.execCommand('insertHTML', `<div class="imgBox"><img class="img-${fileName}" src="${imageBase}"/></div>`);
               callback && callback({
                   imageClass: `img-${fileName}`,
               });
           };

           reader.readAsDataURL(file);

           utils.$('.js-image-input').value = '';

           this.closeModal();
       });
    },
    toggleImageLayer(imageDom){
        let offsetWidth = imageDom.offsetWidth;
        let offsetHeight = imageDom.offsetHeight;

        let imageLayerDom = document.createElement('div');
        imageLayerDom.className = 'imageLayer';
        imageLayerDom.style.width = `${offsetWidth}px`;
        imageLayerDom.style.height = `${offsetHeight}px`;
        imageLayerDom.contentEditable = 'false';
        let imageLayerOther = `<div class="menu">
                                  <ul>
                                      <li data-type="30%">30%</li>
                                      <li data-type="50%">50%</li>.
                                      <li data-type="70%">70%</li>
                                      <li data-type="100%">100%</li>
                                  </ul>
                              </div>`;
        imageLayerDom.innerHTML = imageLayerOther;
        imageDom.parentNode.appendChild(imageLayerDom);

        utils.addEvent(utils.$('.imageLayer'), 'click', (event) =>{
            console.log(event.target);
            if(event.target.tagName.toLowerCase() === 'ul' || event.target.tagName.toLowerCase() === 'li') {
                if (!event.target.dataset.type) return;
                imageDom.style.width = `${offsetWidth * parseInt(event.target.dataset.type) / 100}px`;
                return;
            }
            imageDom.parentNode.removeChild(utils.$('.imageLayer'));
        });
    },
    toggleFullScreen(){
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
            let docElm = document.documentElement;
            if(docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if(docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if(docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if(docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        } else {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if(document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    },

    getText(){
        [...document.querySelectorAll('.js-st-editor-container  .imgBox')].map((item) =>{
            item.removeChild(utils.$('.js-st-editor-container  .imgBox .imageLayer'));
        });
        return utils.$('.js-st-editor-container').innerText;
    },
    getHtml(){
        [...document.querySelectorAll('.js-st-editor-container  .imgBox')].map((item) =>{
            item.removeChild(utils.$('.js-st-editor-container  .imgBox .imageLayer'));
        });
        return utils.$('.js-st-editor-container').innerHTML;
    },
};

export default Editor;
