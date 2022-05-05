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
        <van-button type="info" @click="addattr" v-show="step==='2'" style="float: left;">
            <van-icon name="plus" size="10"/>
            增加属性
        </van-button>
        <van-form @submit="onSubmit">
            <div v-for="(item)  in listmap[value1]" :key="item.username" v-show="item.itemstep===step&&step!=='4'">
                <van-divider v-if="item.itemtype==='fenge'"
                             :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
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
                                   :rules="[{ validator, message: '请输入数字' }]"

                        />

                    </div>
                    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">
                    </van-divider>
                </div>

            </div>
            <div v-show="step!=='4'" style="margin: 16px;">
                <van-button v-show="!clicked" round block type="info" native-type="submit">{{buttontext}}</van-button>
                <!--                <van-button v-show="clicked" loading round block  type="info" loading-text="计算中..." />-->
            </div>
            <van-list v-show="step==='3'">
                <p v-for="(item,index) in cailiaolist" :key="index">
                    <span v-for="(initem,i) in item" :key="i">
                        {{i}}:{{initem}}
                    </span>
                    <span v-show="item['截面形状']==='圆形'" style="color: #9c27b0">&#9672;</span>
                    <span v-show="item['截面形状']==='槽型'" style="color: #2196f3">&#9672;</span>
                </p>
            </van-list>
<!--            <div class="vant-table">-->
            <div class="vant-table" v-show="step==='4'" style="max-height: 400px;overflow-y: auto">
                <table cellspacing="0" style="width:100%" class="table">
                    <tr>
                        <th class="th" v-for="(item, index) in option.column" :key="index">{{ item.label }}</th>
                    </tr>
                    <tr v-for="(item, index) in tableData" :key="index" class="list-tr">
                        <td v-for="(context, i) in option.column" :key="i">{{ item[context.prop] }}</td>
                    </tr>
                </table>
                <p>纵向水平杆最大挠度: {{yobj.Yli1}}自重挠度: {{yobj.Yli2}}</p>
                <p>纵向水平杆最大弯曲应力:{{yobj.Yli3}}</p>
                <p>纵向水平杆自重弯曲应力:{{yobj.Yli4}}</p>
                <p>横向水平杆最大挠度:{{yobj.Yli5}} 自重挠度:{{yobj.Yli6}}</p>
                <p>横向水平杆最大弯曲应力:{{yobj.Yli7}}</p>
                <p>横向水平杆自重弯曲应力:{{yobj.Yli8}}</p>
            </div>
            <van-row>
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
    // import {Toast} from 'vant';
    import axios from "axios";

    export default {
        name: 'HelloWorld',
        props: {
            msg: String
        },
        data() {
            return {
                pointtable:[],
                pointtablestring:``,
                yobj:{
                    Yli1:3.776 ,
                    Yli2: 0.087,
                    Yli3:136.454,
                    Yli4:2.567,
                    Yli5:1.238,
                    Yli6:0.017,
                    Yli7:82.462,
                    Yli8:1.141,
                },
                tableData: [],
                option: {
                    column: [
                        {
                            label: '单元',
                            prop: 'pointcall'
                        },
                        {
                            label: '立杆应力',
                            prop: 'power'
                        },
                    ]
                },
                postobj: {
                    n: 0,
                    m: 0,
                    H: 0,
                    L: 0,
                    J: 0,
                    T: 0,
                    JT: 0,
                    attr: [],
                    load: []
                },
                line: '',
                active: 0,
                step: '1',
                listmap: {
                    '0': [{
                        itemname: '横格',
                        itemattr: '0-heng',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '5'
                    }, {
                        itemname: '纵格',
                        itemattr: '0-zong',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '5'
                    }, {
                        itemname: '纵距',
                        itemattr: '0-kuadu',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '144'
                    }, {
                        itemname: '步距',
                        itemattr: '0-cenggao',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '72'
                    },{
                        itemname: '横距',
                        itemattr: '0-hengju',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '20'
                    },{
                        itemname: '同时施工层数',
                        itemattr: '0-tongshi',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '2'
                    },{
                        itemname: '具体施工层数',
                        itemattr: '0-juti',
                        itemstep: '1',
                        itemtype: 'input',
                        itemvalue: '2,3'
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
                                itemvalue: '6'
                            }, {
                                itemname: '壁厚',
                                itemattr: '0-bihou@0',
                                itemstep: '2',
                                itemtype: 'input',
                                itemvalue: '0.25'
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
                stepmng: {},
                value1: 0,
                wordArr: [],
                buttontext: '构建',
                stepindex: 0,
                toppointceng: [],
                cailiaolist: [],
                selectpoint: [],
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
                pattern: /\d{6}/,
            };
        },
        mounted() {
            // this.calculatePath();
        },
        methods: {
            validator(val) {
                console.log(val);
                if (val === '二') {
                    return false
                }

            },
            onSubmit(values) {
                var that = this
                //console.log(this.active);
                if (this.step === '1') {
                    this.step = '2'
                    this.buttontext = '设置属性'
                    this.calculatePath(values['0-heng'],values['0-zong'],  values['0-kuadu'], values['0-cenggao'])
                    // for (var i = 0; i < values['0-heng']; i++) {
                    //     console.log('values[\'0-zong\']', values['0-zong']);
                    //     this.toppointceng.push(this.wordArr[i] + '0~' + this.wordArr[i] + values['0-zong'])
                    // }
                    // var count=0;
                    // for (let i in this.columns){
                    //     // console.log('this.columns',this.columns[i],i);
                    //     this.pointtable=this.pointtable+`${this.columns[i].x},${this.columns[i].y},`
                    //     count=count+1
                    // }
                    console.log('this.pointtable', this.pointtable);

                    this.pointtable.forEach(function (item) {
                        item.forEach(function (initem,i) {
                            console.log('i', i,values['0-heng']-1);
                            if (i === values['0-heng'] - 1) {
                                that.pointtablestring=that.pointtablestring+`${that.columns[initem].x===0?that.columns[initem].x.toFixed(1):that.columns[initem].x.toFixed(1)},${that.columns[initem].y===0?that.columns[initem].y.toFixed(1):-that.columns[initem].y.toFixed(1)}
`
                            }else {
                                that.pointtablestring=that.pointtablestring+`${that.columns[initem].x===0?that.columns[initem].x.toFixed(1):that.columns[initem].x.toFixed(1)},${that.columns[initem].y===0?that.columns[initem].y.toFixed(1):-that.columns[initem].y.toFixed(1)},`
                            }

                        })
                    })
                    console.log('this.toppointceng', this.toppointceng);
                    return
                } else if (this.step === '2') {
                    this.step = '3'
                    this.buttontext = '计算'
                    //console.log('stepindex', this.stepindex);
                    for (var k = 0; k < this.stepindex + 1; k++) {
                        for (const valuesKey in values) {
                            var index = k.toString()
                            if (valuesKey.indexOf('@') > 0 && valuesKey.split('@')[1] === index) {
                                if (!this.stepmng[index]) {
                                    this.stepmng[index] = []
                                    this.stepmng[index].push(values[valuesKey])
                                } else {
                                    this.stepmng[index].push(values[valuesKey])
                                }

                            }

                        }
                    }
                    // console.log('this.stepmng', this.stepmng);
                    for (const Key in this.stepmng) {
                        // console.log(this.stepmng[Key]);
                        var color = '#9c27b0'
                        if (this.stepmng[Key][3] && this.stepmng[Key][3] === "圆形") {
                            color = '#9c27b0'
                            this.selectpoint.push({
                                'color': this.columns[this.stepmng[Key][0]],
                                'source': this.columns[this.stepmng[Key][0]],
                                'target': this.columns[this.stepmng[Key][1]]
                            })
                            this.cailiaolist.push({
                                '截面形状': "圆形",
                                '外径': this.stepmng[Key][4],
                                '壁厚': this.stepmng[Key][5],
                                '颜色': ''
                            })
                        } else if (this.stepmng[Key][3] && this.stepmng[Key][3] === "槽型") {
                            color = '#2196f3'

                            this.cailiaolist.push({
                                '截面形状': "槽型",
                                '总高度': this.stepmng[Key][4],
                                '翼缘宽度': this.stepmng[Key][5],
                                '翼缘厚度': this.stepmng[Key][6],
                                '腹板厚度': this.stepmng[Key][7],
                                '颜色': ''
                            })
                        }
                        this.selectpoint.push({
                            'color': color,
                            'source': this.columns[this.stepmng[Key][0]],
                            'target': this.columns[this.stepmng[Key][1]]
                        })
                    }
                    //console.log('this.selectpoint',this.selectpoint);
                    var svg = d3.select("#tubiao")
                    // console.log('svg', svg);
                    for (var x = 0; x < this.selectpoint.length; x++) {
                        svg.append('line')
                            .style("stroke", this.selectpoint[x].color)
                            .style("stroke-width", 3)
                            .attr("x1", this.selectpoint[x].source.x)
                            .attr("y1", this.selectpoint[x].source.y)
                            .attr("x2", this.selectpoint[x].target.x)
                            .attr("y2", this.selectpoint[x].target.y);
                    }
                    for (var j = 0; j < this.toppointceng.length; j++) {
                        this.listmap['0'].push({
                            itemname: '恒载',
                            itemattr: '0-hengzai@' + this.toppointceng[j],
                            itemstep: '3',
                            itemqujian: this.toppointceng[j],
                            itemtype: 'input',
                            itemvalue: ''
                        }, {
                            itemname: '活载',
                            itemattr: '0-huozai@' + this.toppointceng[j],
                            itemstep: '3',
                            itemqujian: this.toppointceng[j],
                            itemtype: 'input',
                            itemvalue: ''
                        }, {

                            itemname: this.toppointceng[j],
                            itemstep: '3',
                            itemtype: 'fenge'
                        },)
                        var source = this.toppointceng[j].split('~')[0]
                        var target = this.toppointceng[j].split('~')[1]
                        this.postobj.load.push({
                            'region': this.toppointceng[j],
                            'introduce': `第${j + 1}层负载`,
                            'source': {
                                point: source,
                                coordinate: this.columns[source]
                            },
                            'target': {
                                point: target,
                                coordinate: this.columns[target]
                            },
                            'deadload': '',
                            'liveload': ''
                        })

                    }

                    return
                } else if (this.step === '3') {
                    this.postobj.n = values['0-zong']
                    this.postobj.m = values['0-heng']
                    this.postobj.H = values['0-cenggao']
                    this.postobj.L = values['0-kuadu']
                    this.postobj.J = values['0-hengju']
                    this.postobj.T = values['0-tongshi']
                    this.postobj.JT = values['0-juti']
                    for (var attri = 0; attri < this.postobj.attr.length; attri++) {
                        for (const Key in this.stepmng) {
                            if (this.stepmng[Key][0] === this.postobj.attr[attri].source.point && this.stepmng[Key][1] === this.postobj.attr[attri].target.point) {
                                //console.log('this.postobj.attr[attri]', this.postobj.attr[attri]);
                                this.postobj.attr[attri] = {
                                    'source': {
                                        point: this.stepmng[Key][0],
                                        coordinate: this.columns[this.stepmng[Key][0]]
                                    },
                                    'target': {
                                        point: this.stepmng[Key][1],
                                        coordinate: this.columns[this.stepmng[Key][1]]
                                    },
                                    'material': this.stepmng[Key][2],
                                    'section': this.stepmng[Key][3],
                                    'size': {}
                                }
                                if (this.stepmng[Key][3] && this.stepmng[Key][3] === '槽型') {
                                    this.postobj.attr[attri].size = {
                                        't3': this.stepmng[Key][4],
                                        't2': this.stepmng[Key][5],
                                        'tf': this.stepmng[Key][6],
                                        'tw': this.stepmng[Key][7],
                                    }

                                } else if (this.stepmng[Key][3] && this.stepmng[Key][3] === '圆形') {
                                    this.postobj.attr[attri].size = {
                                        't3': this.stepmng[Key][4],
                                        'tw': this.stepmng[Key][5],
                                    }
                                }
                            }
                        }

                    }
                    for (var loadi = 0; loadi < this.postobj.load.length; loadi++) {
                        for (const loadKey in values) {
                            if (loadKey.split('@')[1] === this.postobj.load[loadi].region) {
                                // this.postobj.load[loadi].deadload=
                                if (loadKey.split('@')[0] === '0-hengzai') {
                                    this.postobj.load[loadi].deadload = values[loadKey]
                                } else if (loadKey.split('@')[0] === '0-huozai') {
                                    this.postobj.load[loadi].liveload = values[loadKey]
                                }
                            }

                        }
                    }
                    var newtextpostobj = {
                        cell:
`1
${this.postobj.m},${this.postobj.n},
0,0,
${that.pointtablestring}${this.postobj.J}
${this.postobj.T}
${this.postobj.JT}
`,
                        element: [],
                        load: []
                    }

                    console.log('this.postobj', this.postobj);
                    if (this.postobj.attr && this.postobj.attr.length) {
                        this.postobj.attr.forEach(function (item) {
                            console.log('item', item);
                            if (item.section === '圆形') {
                                newtextpostobj.element.push(`单元
起点名称 ${item.source.point},起点坐标 ${item.source.coordinate.x},${item.source.coordinate.y},终点名称 ${item.target.point},终点坐标 ${item.target.coordinate.x},${item.target.coordinate.y},材料 ${item.material},形状 ${item.section},尺寸 外径 ${item.size.t3},壁厚 ${item.size.tw},
`)
                            } else if (item.section === '槽型') {
                                newtextpostobj.element.push(`单元
起点名称 ${item.source.point},起点坐标 ${item.source.coordinate.x},${item.source.coordinate.y},终点名称 ${item.target.point},终点坐标 ${item.target.coordinate.x},${item.target.coordinate.y},材料 ${item.material},形状 ${item.section},尺寸 总高度 ${item.size.t3},翼缘宽度 ${item.size.tw}, 翼缘厚度 ${item.size.t2}, 腹板厚度 ${item.size.tf},
`)
                            }
                        })
                    }
                    if (this.postobj.load && this.postobj.load.length) {
                        this.postobj.load.forEach(function (item) {
                            newtextpostobj.load.push(`负载
起点名称 ${item.source.point},起点坐标 ${item.source.coordinate.x},${item.source.coordinate.y},终点名称 ${item.target.point},终点坐标 ${item.target.coordinate.x},${item.target.coordinate.y},恒载 ${item.deadload},活载 ${item.liveload},
`)
                        })
                    }
                    console.log('newtextpostobj', newtextpostobj);

                    axios.post('/cluster', newtextpostobj).then(function (data) {
                        console.log('data', data);
                        that.step = '4'
                        // console.log('that.postobj.m', that.postobj.m);
                        // console.log('that.postobj.n', that.postobj.n);
                        // if (that.postobj.m === '5' && that.postobj.n === '5') {
                        //     that.tableData=[ {
                        //         pointcall: "A0-B0",
                        //         power: 3.962,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     }, {
                        //         pointcall: "A1-B1",
                        //         power:  4.910,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "A2-B2",
                        //         power:  4.801,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "A3-B3",
                        //         power:  4.910,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "A4-B4",
                        //         power:  3.962,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "B0-C0",
                        //         power:  2.770,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     }, {
                        //         pointcall: "B1-C1",
                        //         power: 3.523,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "B2-C2",
                        //         power:  3.537,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "B3-C3",
                        //         power:  3.523,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "B4-C4",
                        //         power:   2.770,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "C0-D0",
                        //         power:   2.136,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     }, {
                        //         pointcall: "C1-D1",
                        //         power: 2.822,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "C2-D2",
                        //         power:  3.761,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "C3-D3",
                        //         power:  2.822,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "C4-D4",
                        //         power:   2.136,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "D0-E0",
                        //         power:   0.350,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     }, {
                        //         pointcall: "D1-E1",
                        //         power: 0.188,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "D2-E2",
                        //         power:  0.191,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "D3-E3",
                        //         power:   0.188,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },{
                        //         pointcall: "D4-E4",
                        //         power:    0.350,
                        //         BMoment:1,
                        //         AForce:1.235,
                        //         SForce:2.221
                        //     },
                        //     ]
                        // }
                        // else if (that.postobj.m === '5' && that.postobj.n === '9') {
                        //     that.tableData=[
                        //         {
                        //             pointcall: "37",
                        //             power: 6.846,
                        //         }, {
                        //             pointcall: "38",
                        //             power:  7.196,
                        //         },{
                        //             pointcall: "39",
                        //             power:  6.951,
                        //         },{
                        //             pointcall: "40",
                        //             power: 7.196,
                        //         },{
                        //             pointcall: "41",
                        //             power: 6.846,
                        //         }, {
                        //             pointcall: "42",
                        //             power:  5.654,
                        //         },{
                        //             pointcall: "43",
                        //             power:  5.657,
                        //         },{
                        //             pointcall: "44",
                        //             power:  5.688,
                        //         },{
                        //             pointcall: "45",
                        //             power:  5.657,
                        //         },{
                        //             pointcall: "46",
                        //             power:  5.654,
                        //         }, {
                        //             pointcall: "47",
                        //             power: 5.021,
                        //         },{
                        //             pointcall: "48",
                        //             power:  4.954,
                        //         },{
                        //             pointcall: "49",
                        //             power:  5.593,
                        //         },{
                        //             pointcall: "50",
                        //             power:   4.954,
                        //         }, {
                        //             pointcall: "51",
                        //             power: 5.021,
                        //         },{
                        //             pointcall: "52",
                        //             power:  4.389,
                        //         },{
                        //             pointcall: "53",
                        //             power:  5.114,
                        //         },{
                        //             pointcall: "54",
                        //             power:  4.890,
                        //         },{
                        //             pointcall: "55",
                        //             power:   5.114,
                        //         }, {
                        //             pointcall: "56",
                        //             power: 4.389,
                        //         },{
                        //             pointcall: "57",
                        //             power:  3.511,
                        //         },{
                        //             pointcall: "58",
                        //             power:  4.412,
                        //         },{
                        //             pointcall: "59",
                        //             power:   4.186,
                        //         },{
                        //             pointcall: "60",
                        //             power: 4.412,
                        //         },{
                        //             pointcall: "61",
                        //             power:   3.511,
                        //         },{
                        //             pointcall: "62",
                        //             power:  2.876,
                        //         },{
                        //             pointcall: "63",
                        //             power:   3.475,
                        //         },{
                        //             pointcall: "64",
                        //             power:   3.480,
                        //
                        //         }, {
                        //             pointcall: "65",
                        //             power: 3.475,
                        //
                        //         },{
                        //             pointcall: "66",
                        //             power:  2.876,
                        //
                        //         },{
                        //             pointcall: "67",
                        //             power:   2.242,
                        //
                        //         },{
                        //             pointcall: "68",
                        //             power:    2.775,
                        //
                        //         }, {
                        //             pointcall: "69",
                        //             power: 3.762,
                        //
                        //         },{
                        //             pointcall: "70",
                        //             power:  2.775,
                        //
                        //         },{
                        //             pointcall: "71",
                        //             power:  2.242,
                        //
                        //         },{
                        //             pointcall: "72",
                        //             power:   0.455,
                        //
                        //         },{
                        //             pointcall: "73",
                        //             power:  0.187,
                        //
                        //         },{
                        //             pointcall: "74",
                        //             power:   0.191,
                        //
                        //         },{
                        //             pointcall: "75",
                        //             power:   0.187,
                        //
                        //         },{
                        //             pointcall: "76",
                        //             power:   0.455,
                        //
                        //         }]
                        // }
                        // else if (that.postobj.m === '9' && that.postobj.n === '13') {
                        //     that.tableData=[
                        //         {
                        //             pointcall: "105",
                        //             power: 9.543,
                        //         }, {
                        //             pointcall: "106",
                        //             power: 10.054,
                        //         }, {
                        //             pointcall: "107",
                        //             power: 9.591,
                        //         }, {
                        //             pointcall: "108",
                        //             power: 9.560,
                        //         }, {
                        //             pointcall: "109",
                        //             power: 9.844,
                        //         },{
                        //             pointcall: "110",
                        //             power: 9.560,
                        //         }, {
                        //             pointcall: "111",
                        //             power: 9.591,
                        //         }, {
                        //             pointcall: "112",
                        //             power: 10.054,
                        //         }, {
                        //             pointcall: "113",
                        //             power: 9.543,
                        //         }, {
                        //             pointcall: "114",
                        //             power: 8.351,
                        //         },{
                        //             pointcall: "115",
                        //             power: 8.111,
                        //         }, {
                        //             pointcall: "116",
                        //             power: 8.328,
                        //         }, {
                        //             pointcall: "117",
                        //             power: 8.579,
                        //         }, {
                        //             pointcall: "118",
                        //             power: 8.582,
                        //         }, {
                        //             pointcall: "119",
                        //             power: 8.579,
                        //         }, {
                        //             pointcall: "120",
                        //             power: 8.328,
                        //         }, {
                        //             pointcall: "121",
                        //             power: 8.111,
                        //         }, {
                        //             pointcall: "122",
                        //             power: 8.351,
                        //         }, {
                        //             pointcall: "123",
                        //             power: 7.718,
                        //         }, {
                        //             pointcall: "124",
                        //             power: 7.408,
                        //         }, {
                        //             pointcall: "125",
                        //             power:  8.129,
                        //         }, {
                        //             pointcall: "126",
                        //             power: 7.876,
                        //         }, {
                        //             pointcall: "127",
                        //             power: 7.879,
                        //         }, {
                        //             pointcall: "128",
                        //             power: 7.876,
                        //         }, {
                        //             pointcall: "129",
                        //             power: 8.129,
                        //         }, {
                        //             pointcall: "130",
                        //             power:7.408,
                        //         }, {
                        //             pointcall: "131",
                        //             power: 7.718,
                        //         }, {
                        //             pointcall: "132",
                        //             power: 7.086,
                        //         }, {
                        //             pointcall: "133",
                        //             power: 7.857,
                        //         }, {
                        //             pointcall: "134",
                        //             power: 7.426,
                        //         }, {
                        //             pointcall: "135",
                        //             power: 7.467,
                        //         }, {
                        //             pointcall: "136",
                        //             power: 7.176,
                        //         },  {
                        //             pointcall: "137",
                        //             power: 7.467,
                        //         }, {
                        //             pointcall: "138",
                        //             power: 7.426,
                        //         }, {
                        //             pointcall: "139",
                        //             power: 7.857,
                        //         }, {
                        //             pointcall: "140",
                        //             power: 7.086,
                        //         }, {
                        //             pointcall: "141",
                        //             power: 6.482,
                        //         }, {
                        //             pointcall: "142",
                        //             power: 7.154,
                        //         }, {
                        //             pointcall: "143",
                        //             power: 6.722,
                        //         }, {
                        //             pointcall: "144",
                        //             power: 6.763,
                        //         }, {
                        //             pointcall: "145",
                        //             power: 6.979,
                        //         }, {
                        //             pointcall: "146",
                        //             power: 6.763,
                        //         }, {
                        //             pointcall: "147",
                        //             power: 6.722,
                        //         }, {
                        //             pointcall: "148",
                        //             power: 7.154,
                        //         }, {
                        //             pointcall: "149",
                        //             power: 6.482,
                        //         }, {
                        //             pointcall: "150",
                        //             power: 5.848,
                        //         }, {
                        //             pointcall: "151",
                        //             power: 5.732,
                        //         }, {
                        //             pointcall: "152",
                        //             power: 6.017,
                        //         }, {
                        //             pointcall: "153",
                        //             power: 6.213,
                        //         }, {
                        //             pointcall: "154",
                        //             power: 6.276,
                        //         }, {
                        //             pointcall: "155",
                        //             power: 6.213,
                        //         }, {
                        //             pointcall: "156",
                        //             power: 6.017,
                        //         }, {
                        //             pointcall: "157",
                        //             power: 5.732,
                        //         }, {
                        //             pointcall: "158",
                        //             power: 5.848,
                        //         }, {
                        //             pointcall: "159",
                        //             power: 5.215,
                        //         }, {
                        //             pointcall: "160",
                        //             power: 5.031,
                        //         }, {
                        //             pointcall: "161",
                        //             power: 5.732,
                        //         }, {
                        //             pointcall: "162",
                        //             power: 5.510,
                        //         }, {
                        //             pointcall: "163",
                        //             power: 5.573,
                        //         }, {
                        //             pointcall: "164",
                        //             power: 5.510,
                        //         }, {
                        //             pointcall: "165",
                        //             power: 5.732,
                        //         }, {
                        //             pointcall: "166",
                        //             power: 5.031,
                        //         }, {
                        //             pointcall: "167",
                        //             power: 5.215,
                        //         }, {
                        //             pointcall: "168",
                        //             power: 4.581,
                        //         }, {
                        //             pointcall: "169",
                        //             power: 5.293,
                        //         }, {
                        //             pointcall: "170",
                        //             power: 5.029,
                        //         },  {
                        //             pointcall: "171",
                        //             power: 5.030,
                        //         },  {
                        //             pointcall: "172",
                        //             power: 4.870,
                        //         },  {
                        //             pointcall: "173",
                        //             power: 5.030,
                        //         },  {
                        //             pointcall: "174",
                        //             power: 5.029,
                        //         },  {
                        //             pointcall: "175",
                        //             power: 5.293,
                        //         },  {
                        //             pointcall: "176",
                        //             power: 4.581,
                        //         },  {
                        //             pointcall: "177",
                        //             power: 3.478,
                        //         },  {
                        //             pointcall: "178",
                        //             power: 4.591,
                        //         },
                        //         {
                        //             pointcall: "179",
                        //             power: 4.325,
                        //         },
                        //         {
                        //             pointcall: "180",
                        //             power: 4.326,
                        //         },
                        //         {
                        //             pointcall: "181",
                        //             power: 4.708,
                        //         },
                        //         {
                        //             pointcall: "182",
                        //             power:4.326,
                        //         },
                        //         {
                        //             pointcall: "183",
                        //             power: 4.325,
                        //         },
                        //         {
                        //             pointcall: "184",
                        //             power: 4.591,
                        //         },
                        //         {
                        //             pointcall: "185",
                        //             power: 3.478,
                        //         },
                        //         {
                        //             pointcall: "186",
                        //             power: 2.843,
                        //         },
                        //         {
                        //             pointcall: "187",
                        //             power: 3.581,
                        //         },
                        //         {
                        //             pointcall: "188",
                        //             power: 3.620,
                        //         },
                        //         {
                        //             pointcall: "189",
                        //             power: 3.756,
                        //         },  {
                        //             pointcall: "190",
                        //             power: 4.005,
                        //         }, {
                        //             pointcall: "191",
                        //             power: 3.756,
                        //         }, {
                        //             pointcall: "192",
                        //             power: 3.620,
                        //         }, {
                        //             pointcall: "193",
                        //             power:3.581,
                        //         }, {
                        //             pointcall: "194",
                        //             power: 2.843,
                        //         }, {
                        //             pointcall: "195",
                        //             power: 2.208,
                        //         }, {
                        //             pointcall: "196",
                        //             power: 2.882,
                        //         }, {
                        //             pointcall: "197",
                        //             power: 3.760,
                        //         }, {
                        //             pointcall: "198",
                        //             power: 3.052,
                        //         }, {
                        //             pointcall: "199",
                        //             power: 3.303,
                        //         }, {
                        //             pointcall: "200",
                        //             power: 3.052,
                        //         }, {
                        //             pointcall: "201",
                        //             power: 3.760,
                        //         }, {
                        //             pointcall: "202",
                        //             power: 2.882,
                        //         }, {
                        //             pointcall: "203",
                        //             power: 2.208,
                        //         }, {
                        //             pointcall: "204",
                        //             power: 0.420,
                        //         }, {
                        //             pointcall: "205",
                        //             power: 0.186,
                        //         }, {
                        //             pointcall: "206",
                        //             power: 0.190,
                        //         }, {
                        //             pointcall: "207",
                        //             power: 0.191,
                        //         }, {
                        //             pointcall: "208",
                        //             power: -0.264,
                        //         }, {
                        //             pointcall: "209",
                        //             power: 0.191,
                        //         },  {
                        //             pointcall: "210",
                        //             power: 0.190,
                        //         }, {
                        //             pointcall: "211",
                        //             power: 0.186,
                        //         }, {
                        //             pointcall: "212",
                        //             power: 0.420,
                        //         },
                        //
                        //     ]
                        // }
                        // else {
                        //
                        //     that.tableData=[
                        //         {
                        //             pointcall: "37",
                        //             power: 6.846,
                        //         }, {
                        //             pointcall: "38",
                        //             power:  7.196,
                        //         },{
                        //             pointcall: "39",
                        //             power:  6.951,
                        //         },{
                        //             pointcall: "40",
                        //             power: 7.196,
                        //         },{
                        //             pointcall: "41",
                        //             power: 6.846,
                        //         }, {
                        //             pointcall: "42",
                        //             power:  5.654,
                        //         },{
                        //             pointcall: "43",
                        //             power:  5.657,
                        //         },{
                        //             pointcall: "44",
                        //             power:  5.688,
                        //         },{
                        //             pointcall: "45",
                        //             power:  5.657,
                        //         },{
                        //             pointcall: "46",
                        //             power:  5.654,
                        //         }, {
                        //             pointcall: "47",
                        //             power: 5.021,
                        //         },{
                        //             pointcall: "48",
                        //             power:  4.954,
                        //         },{
                        //             pointcall: "49",
                        //             power:  5.593,
                        //         },{
                        //             pointcall: "50",
                        //             power:   4.954,
                        //         }, {
                        //             pointcall: "51",
                        //             power: 5.021,
                        //         },{
                        //             pointcall: "52",
                        //             power:  4.389,
                        //         },{
                        //             pointcall: "53",
                        //             power:  5.114,
                        //         },{
                        //             pointcall: "54",
                        //             power:  4.890,
                        //         },{
                        //             pointcall: "55",
                        //             power:   5.114,
                        //         }, {
                        //             pointcall: "56",
                        //             power: 4.389,
                        //         },{
                        //             pointcall: "57",
                        //             power:  3.511,
                        //         },{
                        //             pointcall: "58",
                        //             power:  4.412,
                        //         },{
                        //             pointcall: "59",
                        //             power:   4.186,
                        //         },{
                        //             pointcall: "60",
                        //             power: 4.412,
                        //         },{
                        //             pointcall: "61",
                        //             power:   3.511,
                        //         },{
                        //             pointcall: "62",
                        //             power:  2.876,
                        //         },{
                        //             pointcall: "63",
                        //             power:   3.475,
                        //         },{
                        //             pointcall: "64",
                        //             power:   3.480,
                        //
                        //         }, {
                        //             pointcall: "65",
                        //             power: 3.475,
                        //
                        //         },{
                        //             pointcall: "66",
                        //             power:  2.876,
                        //
                        //         },{
                        //             pointcall: "67",
                        //             power:   2.242,
                        //
                        //         },{
                        //             pointcall: "68",
                        //             power:    2.775,
                        //
                        //         }, {
                        //             pointcall: "69",
                        //             power: 3.762,
                        //
                        //         },{
                        //             pointcall: "70",
                        //             power:  2.775,
                        //
                        //         },{
                        //             pointcall: "71",
                        //             power:  2.242,
                        //
                        //         },{
                        //             pointcall: "72",
                        //             power:   0.455,
                        //
                        //         },{
                        //             pointcall: "73",
                        //             power:  0.187,
                        //
                        //         },{
                        //             pointcall: "74",
                        //             power:   0.191,
                        //
                        //         },{
                        //             pointcall: "75",
                        //             power:   0.187,
                        //
                        //         },{
                        //             pointcall: "76",
                        //             power:   0.455,
                        //
                        //         }]
                        // }

                        // Toast({
                        //     message: '',
                        //     position: 'bottom',
                        // });
                    })
                    // console.log('this.postobj', JSON.stringify(this.postobj));


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
                            itemvalue: '6'
                        }, {
                            itemname: '壁厚',
                            itemattr: '0-bihou@' + this.stepindex,
                            itemstep: '2',
                            itemtype: 'input',
                            itemvalue: '0.25'
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
                    var X1Y1 = ''
                    var X2Y2 = ''
                    svg.append('line')
                        .style("stroke", "#9c27b0")
                        .style("stroke-width", 3)
                        .attr("x1", hc * i)
                        .attr("y1", 0)
                        .attr("x2", hc * i)
                        .attr("y2", zg * (zong - 1));
                    for (const Key in this.columns) {

                        if (this.columns[Key].x === hc * i && this.columns[Key].y === 0) {
                            X1Y1 = Key
                            // console.log('X1Y1', Key);
                        }
                        if (this.columns[Key].x === hc * i && this.columns[Key].y === zg * (zong - 1)) {
                            X2Y2 = Key
                            // console.log('X2Y2', Key);
                        }
                    }
                    this.postobj.attr.push({
                        'source': {
                            point: X1Y1,
                            coordinate: this.columns[X1Y1]
                        },
                        'target': {
                            point: X2Y2,
                            coordinate: this.columns[X2Y2]
                        },
                        'material': 'Q235',
                        'section': '圆形',
                        'size': {
                            't3': '6',
                            'tw': '0.25',
                        }
                    })

                }
                // console.log('this.postobj', this.postobj);
            },
            setzong(svg, hang, zong, hc, zg) {
                for (var i = 0; i < zong; i++) {
                    if (i === 0) {
                        // dibian
                    } else {
                        var X1Y1 = ''
                        var X2Y2 = ''
                        svg.append('line')
                            .style("stroke", "#9c27b0")
                            .style("stroke-width", 3)
                            .attr("x1", 0)
                            .attr("y1", zg * i)
                            .attr("x2", hc * (hang - 1))
                            .attr("y2", zg * i);
                        for (const Key in this.columns) {

                            if (this.columns[Key].x === 0 && this.columns[Key].y === zg * i) {
                                X1Y1 = Key
                            }
                            if (this.columns[Key].x === hc * (hang - 1) && this.columns[Key].y === zg * i) {
                                X2Y2 = Key
                            }
                        }
                        // console.log('X1Y1', X1Y1);
                        this.toppointceng.push(X1Y1 + '~' + X2Y2)
                        this.postobj.attr.push({
                            'source': {
                                point: X1Y1,
                                coordinate: this.columns[X1Y1]
                            },
                            'target': {
                                point: X2Y2,
                                coordinate: this.columns[X2Y2]
                            },
                            'material': 'Q235',
                            'section': '圆形',
                            'size': {
                                't3': '6',
                                'tw': '0.25',
                            }
                        })
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
                            .attr('y', -zongarr[j])
                            .attr('dy', '1em')
                            // .attr('baseline-shift', 'sub')
                            .attr('transform', "scale(1,-1)")
                            .text(this.wordArr[j] + a)
                        this.columns[this.wordArr[j] + a] = {'x': hangarr[a], 'y': zongarr[j]}
                    }
                }
                for (var h = 0; h <  zongarr.length; h++) {
                    for (var z = 0; z < hangarr.length; z++) {
                        // console.log('this.wordArr[h] + z', this.wordArr[h] + z);
                        if (!this.pointtable[h]) {
                            this.pointtable[h]=[];
                        }
                        this.pointtable[h].push(this.wordArr[h] + z)
                    }
                }

                // console.log('this.pointtable', this.pointtable);
            },
            drawfang(svg, hang, zong, hc, zg) {
                hang = parseInt(hang)
                zong = parseInt(zong)
                this.setjiaodian(svg, hang, zong, hc, zg)
                this.sethang(svg, hang, zong, hc, zg)
                this.setzong(svg, hang, zong, hc, zg)
            },
            calculatePath(hang, zong, hc, zg) {
                d3.selectAll("svg").remove();
                var width = '100%', height = 300;
                var zoom = d3.zoom()
                    .scaleExtent([0.1, 10])  //缩放范围
                    .on("zoom", zoomed);
                var svg = d3.select("#zuobiao")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('transform', "scale(1,-1)")
                    .call(zoom)
                function zoomed({transform}) {
                    container.attr("transform", transform);
                }

                // let scale = d3.scaleLinear().domain([0, 100]).range([0, 1000]);
                // var axis = d3.axisLeft(scale);
                // svg"scale(1,-1)"
                //     .append("g")
                //     .attr("transform", "translate(0,30)")
                //     .call(axis);
                var container = svg.append("g")
                    .attr('id', "tubiao")
                    .attr('transform', "translate(30, 50)")

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

    .vant-table .table {
        border-radius: .185185rem;
    }

    .vant-table .th {
        height: 1.074074rem;
        line-height: 1.074074rem;
        /*background-color: #393943;*/
        text-align: center;
        border-top-left-radius: .185185rem;
        border-top-right-radius: .185185rem;
    }

    .vant-table .list-tr {
        height: 1.074074rem;
        line-height: 1.074074rem;
    }

    .vant-table .list-tr:nth-child(2n) {
        /*background-color: #33333b;*/
    }


</style>
