<template>
    <div class="hello">
        <van-dropdown-menu active-color="#1989fa">
            <van-dropdown-item v-model="value1" :options="option1"/>
            <!--            <van-dropdown-item v-model="value2" :options="option2" />-->
        </van-dropdown-menu>
        <!--        <van-picker-->
        <!--                title="标题"-->
        <!--                show-toolbar-->
        <!--                :columns="columns"-->
        <!--                @confirm="onConfirm"-->
        <!--                @cancel="onCancel"-->
        <!--                @change="onChange"-->
        <!--        />-->
        <van-button type="info" @click="addattr" v-show="step==='2'" style="float: left;"><van-icon name="plus" size="10" />增加属性</van-button>
        <van-form @submit="onSubmit">
            <div v-for="(item)  in listmap[value1]" :key="item.username" v-show="item.itemstep===step">
                <van-divider v-if="item.itemtype==='fenge'" :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
                    {{item.itemname}}
                </van-divider>
                <van-field v-model=item.itemvalue
                           v-if="item.itemtype==='input'"
                           :name=item.itemattr
                           :label=item.itemname
                           :placeholder=item.itemname
                />
                <van-field
                        v-if="item.itemtype==='radio'"
                        :name=item.itemattr
                        :label=item.itemname
                >
                    <template #input>
                        <van-radio-group v-model=item.itemvalue
                                         direction="horizontal">
                            <van-radio v-for="(radio)  in item.itemradioarr" :key="radio" :name="radio">
                                {{radio}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <div v-if="item.itemname==='截面形状'" style="">
                    <div v-for="(chicun)  in item.itemchicun[item.itemvalue]" :key="chicun.username">
                        <van-field v-model=chicun.itemvalue
                                   v-if="chicun.itemtype==='input'"
                                   :name=chicun.itemattr
                                   :label=chicun.itemname
                                   :placeholder=chicun.itemname
                        />

                    </div>
                    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
                    </van-divider>
                </div>

            </div>
            <div style="margin: 16px;">
                <van-button v-show="!clicked" round block type="info" native-type="submit">{{buttontext}}</van-button>
                <!--                <van-button v-show="clicked" loading round block  type="info" loading-text="计算中..." />-->
            </div>
            <van-list v-show="step==='3'">
                <p v-for="(item,index) in cailiaolist" :key="index" >
                    <span v-for="(initem,i) in item" :key="i">
                        {{i}}:{{initem}}
                    </span>
                    <span v-show="item['截面形状']==='圆形'" style="color: #9c27b0">&#9672;</span>
                    <span v-show="item['截面形状']==='槽型'" style="color: #2196f3">&#9672;</span>
                </p>
            </van-list>
            <van-row >
                <van-col span="24">
                    <div id="zuobiao">
                    </div>
                </van-col>
            </van-row>

        </van-form>
        <van-tabbar v-model="active">
            <van-tabbar-item icon="home-o">云计算</van-tabbar-item>
            <van-tabbar-item icon="search" dot>搜索</van-tabbar-item>
            <van-tabbar-item icon="friends-o" badge="5">联系</van-tabbar-item>
            <van-tabbar-item icon="setting-o" badge="20">设置</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
    import * as d3 from 'd3'

    export default {

        name: 'HelloWorld',
        props: {
            msg: String
        },
        data() {
            return {
                line: '',
                active: 0,
                step: '1',
                listmap: {
                    '0': [{
                        itemname: '横格',
                        itemattr: '0-heng',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '2'
                    }, {
                        itemname: '纵格',
                        itemattr: '0-zong',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '3'
                    }, {
                        itemname: '跨度',
                        itemattr: '0-kuadu',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '288'
                    }, {
                        itemname: '层高',
                        itemattr: '0-cenggao',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '144'
                    }, {
                        itemname: '起点',
                        itemattr: '0-source@0',
                        itemstep: '2',
                        itemtype: 'input',
                        itemvalue: ''
                    }, {
                        itemname: '终点',
                        itemattr: '0-target@0',
                        itemstep: '2',
                        itemtype: 'input',
                        itemvalue: ''
                    }, {
                        itemname: '材料',
                        itemattr: '0-cailiao@0',
                        itemstep: '2',
                        itemtype: 'radio',
                        itemvalue: 'Q235',
                        itemradioarr: ['Q235', 'Q385']
                    }, {
                        itemname: '截面形状',
                        itemattr: '0-jiemian@0',
                        itemstep: '2',
                        itemtype: 'radio',
                        itemvalue: '圆形',
                        itemradioarr: ['圆形', '槽型'],
                        itemchicun: {
                            '圆形': [{
                                itemname: '外径',
                                itemattr: '0-waijing@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: ''
                            }, {
                                itemname: '壁厚',
                                itemattr: '0-bihou@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: ''
                            }], '槽型': [{
                                itemname: '总高度',
                                itemattr: '0-zonggaodu@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: ''
                            }, {
                                itemname: '翼缘宽度',
                                itemattr: '0-yiyuankuan@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: ''
                            }, {
                                itemname: '翼缘厚度',
                                itemattr: '0-yiyuanhou@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: ''
                            }, {
                                itemname: '腹板厚度',
                                itemattr: '0-fubanhou@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: ''
                            }]
                        }

                    }],
                    '1': [],
                },
                clicked: false,
                columns: {},
                stepmng:{},
                value1: 0,
                wordArr: [],
                buttontext: '构建',
                stepindex: 0,
                toppointceng: [],
                cailiaolist:[],
                selectpoint:[],
                option1: [
                    {text: '平面框架和桁架的内力计算', value: 0},
                    {text: '钢筋混凝土配筋验算', value: 1},
                    {text: '边坡、支护、挡土墙快速算法', value: 2},
                    {text: '连续梁快速算法', value: 3},
                    {text: '柱与支撑的屈服算法', value: 4},
                    {text: '楼板内力快速算法', value: 5},
                    {text: '钢、木等结构的安全验算', value: 6},
                    {text: '测量、大地坐标', value: 7},
                    {text: '电工的常用算法', value: 8},
                    {text: '水暖的常用算法', value: 9},
                ],

            };
        },
        mounted() {
            // this.calculatePath();
        },
        methods: {
            onSubmit(values) {
                console.log(this.active);
                if (this.step === '1') {
                    this.step = '2'
                    this.buttontext = '设置属性'
                    this.calculatePath(values['0-zong'], values['0-heng'], values['0-kuadu'], values['0-cenggao'])
                    for (var i = 0; i < values['0-heng']; i++) {
                        this.toppointceng.push(this.wordArr[i] + '0~' + this.wordArr[i] + values['0-zong'])
                    }
                    console.log('this.columns', this.columns);
                    return
                }
                else if (this.step === '2') {
                    // var hascircle=false
                    // var hascao=false

                    this.step = '3'
                    this.buttontext = '计算'
                    console.log('stepindex', this.stepindex);
                    for (var k = 0; k <this.stepindex+1; k++){
                        for (const valuesKey in values) {
                            var index=k.toString()
                            if (valuesKey.indexOf('@')>0&&valuesKey.split('@')[1] ===index) {
                                if (!this.stepmng[index]) {
                                    this.stepmng[index]=[]
                                    this.stepmng[index].push(values[valuesKey])
                                }else {
                                    this.stepmng[index].push(values[valuesKey])
                                }

                            }

                        }
                    }
                    console.log('this.stepmng', this.stepmng);
                    for (const Key in this.stepmng) {
                        console.log(this.stepmng[Key]);
                        var color='#9c27b0'
                        if (this.stepmng[Key][3]&&this.stepmng[Key][3]==="圆形") {
                            color='#9c27b0'
                            this.selectpoint.push({'color':this.columns[this.stepmng[Key][0]],'source':this.columns[this.stepmng[Key][0]],'target':this.columns[this.stepmng[Key][1]]})
                            this.cailiaolist.push({'截面形状':"圆形",'外径':this.stepmng[Key][4],'壁厚':this.stepmng[Key][5],'颜色':''})
                        }else if (this.stepmng[Key][3]&&this.stepmng[Key][3]==="槽型") {
                            color='#2196f3'

                            this.cailiaolist.push({'截面形状':"槽型",'总高度':this.stepmng[Key][4],'翼缘宽度':this.stepmng[Key][5],'翼缘厚度':this.stepmng[Key][6],'腹板厚度':this.stepmng[Key][7],'颜色':''})
                        }
                        this.selectpoint.push({'color':color,'source':this.columns[this.stepmng[Key][0]],'target':this.columns[this.stepmng[Key][1]]})
                    }
                    console.log('this.selectpoint',this.selectpoint);
                    var svg = d3.select("#tubiao")
                    // console.log('svg', svg);
                    for (var x = 0; x <this.selectpoint.length; x++) {
                        svg.append('line')
                            .style("stroke", this.selectpoint[x].color)
                            .style("stroke-width", 3)
                            .attr("x1", this.selectpoint[x].source.x)
                            .attr("y1", this.selectpoint[x].source.y)
                            .attr("x2", this.selectpoint[x].target.x)
                            .attr("y2", this.selectpoint[x].target.y);

                    }
                    for (var j = 0; j <this.toppointceng.length; j++) {
                        this.listmap['0'].push({
                            itemname: '恒载',
                                itemattr: '0-hengzai@'+this.toppointceng[j],
                                itemstep: '3',
                                itemqujian:this.toppointceng[j],
                                itemtype: 'input',
                                itemvalue: ''
                        },{
                            itemname: '活载',
                                itemattr: '0-huozai@'+this.toppointceng[j],
                                itemstep: '3',
                                itemqujian:this.toppointceng[j],
                                itemtype: 'input',
                                itemvalue: ''
                        },{

                            itemname:this.toppointceng[j],
                            itemstep: '3',
                            itemtype: 'fenge'
                        },)
                    }
                    return
                }
                console.log('submit', values);

            },
            addattr() {
                this.stepindex = parseInt(this.stepindex) + 1
                console.log('this.stepindex', this.stepindex);
                this.listmap['0'].push({
                    itemname: '起点',
                    itemattr: '0-source@' + this.stepindex,
                    itemstep: '2',
                    itemtype: 'input',
                    itemvalue: ''
                })
                this.listmap['0'].push({
                    itemname: '终点',
                    itemattr: '0-target@' + this.stepindex,
                    itemstep: '2',
                    itemtype: 'input',
                    itemvalue: ''
                })
                this.listmap['0'].push({
                    itemname: '材料',
                    itemattr: '0-cailiao@' + this.stepindex,
                    itemstep: '2',
                    itemtype: 'radio',
                    itemvalue: 'Q235',
                    itemradioarr: ['Q235', 'Q385']
                })
                this.listmap['0'].push({
                    itemname: '截面形状',
                    itemattr: '0-jiemian@' + this.stepindex,
                    itemstep: '2',
                    itemtype: 'radio',
                    itemvalue: '圆形',
                    itemradioarr: ['圆形', '槽型'],
                    itemchicun: {
                        '圆形': [{
                            itemname: '外径',
                            itemattr: '0-waijing@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: ''
                        }, {
                            itemname: '壁厚',
                            itemattr: '0-bihou@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: ''
                        }], '槽型': [{
                            itemname: '总高度',
                            itemattr: '0-zonggaodu@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: ''
                        }, {
                            itemname: '翼缘宽度',
                            itemattr: '0-yiyuankuan@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: ''
                        }, {
                            itemname: '翼缘厚度',
                            itemattr: '0-yiyuanhou@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: ''
                        }, {
                            itemname: '腹板厚度',
                            itemattr: '0-fubanhou@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: ''
                        }]
                    }

                })
            },
            sethang(svg, hang, zong, hc, zg) {
                for (var i = 0; i < hang; i++) {
                    svg.append('line')
                        .style("stroke", "#9c27b0")
                        .style("stroke-width", 3)
                        .attr("x1", hc * i)
                        .attr("y1", 0)
                        .attr("x2", hc * i)
                        .attr("y2", zg * (zong - 1));
                }
            },
            setzong(svg, hang, zong, hc, zg) {

                for (var i = 0; i < zong; i++) {
                    if (i == zong - 1) {
                        // svg.append('line')
                        //     .style("stroke", "black")
                        //     .style("stroke-width", 4)
                        //     .attr("x1", 0)
                        //     .attr("y1", zg * i)
                        //     .attr("x2", hc * (hang - 1))
                        //     .attr("y2", zg * i);
                    } else {
                        svg.append('line')
                            .style("stroke", "#9c27b0")
                            .style("stroke-width", 3)
                            .attr("x1", 0)
                            .attr("y1", zg * i)
                            .attr("x2", hc * (hang - 1))
                            .attr("y2", zg * i);
                    }

                }
            },
            setjiaodian(svg, hang, zong, hc, zg) {
                var hangarr = []
                var zongarr = []
                for (var w = 65; w < 91; w++) {
                    this.wordArr.push(String.fromCharCode(w))
                }
                // console.log('this.wordArr', this.wordArr);

                for (var i = 0; i < hang; i++) {
                    hangarr.push(i * hc)
                }
                for (var k = 0; k < zong; k++) {
                    zongarr.push(k * zg)
                }
                for (var a = 0; a < hangarr.length; a++) {
                    for (var j = 0; j < zongarr.length; j++) {
                        svg.append('text')
                            .attr('x', hangarr[a])
                            .attr('y', zongarr[j])
                            .attr('dy', '1em')
                            .text(this.wordArr[j] + a)
                        this.columns[this.wordArr[j] + a]={'x': hangarr[a], 'y': zongarr[j]}
                    }
                }
            },
            drawfang(svg, hang, zong, hc, zg) {
                hang = parseInt(hang) + 1
                zong = parseInt(zong) + 1
                this.sethang(svg, hang, zong, hc, zg)
                this.setzong(svg, hang, zong, hc, zg)
                this.setjiaodian(svg, hang, zong, hc, zg)
            },
            calculatePath(hang, zong, hc, zg) {
                d3.selectAll("svg").remove();
                var width = '100%', height = 500;
                var zoom = d3.zoom()
                    .scaleExtent([0.1, 10])  //缩放范围
                    .on("zoom", zoomed);
                var svg = d3.select("#zuobiao")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .call(zoom)

                function zoomed({transform}) {
                    container.attr("transform", transform);
                }

                var container = svg.append("g")
                    .attr('id', "tubiao")
                    .attr('transform', "translate(10, 10)")

                this.drawfang(container, hang, zong, hc, zg)
            },
        },

    }
</script>

<style scoped>
    h3 {
        margin: 40px 0 0;
    }
    .van-cell::after {
        border: none;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
