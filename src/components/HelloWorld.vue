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
        <van-form @submit="onSubmit">
            <div  v-for="(item)  in listmap[value1]" :key="item.username">
                <van-field  v-model=item.itemvalue
                            :name=item.itemname
                            :label=item.itemname
                            :placeholder=item.itemname
                />
            </div>

<!--            <van-field-->
<!--                    v-model="password"-->
<!--                    type="password"-->
<!--                    name="密码"-->
<!--                    label="密码"-->
<!--                    placeholder="密码"-->
<!--            />-->
            <div style="margin: 16px;">
                <van-button v-show="!clicked" round block type="info" native-type="submit">计算</van-button>
                <van-button v-show="clicked" loading round block  type="info" loading-text="计算中..." />


            </div>
            <div id="zuobiao">
<!--                <svg width="500" height="270">-->
<!--                    <g style="transform: translate(0, 10px)">-->
<!--                        <path :d="line" />-->
<!--                    </g>-->
<!--                </svg>-->
            </div>
        </van-form>
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
                data: [0, 1, 2, 3, 4, 5],
                line: '',
                listmap:{
                    '0':[{
                        itemname:'横格',
                        itemattr:'0-tie',
                        itemvalue:''
                    },{
                        itemname:'纵格',
                        itemattr:'0-mu',
                        itemvalue:''
                    },{
                        itemname:'间隔',
                        itemattr:'0-jinbi',
                        itemvalue:''
                    },{
                        itemname:'人口',
                        itemattr:'0-penple',
                        itemvalue:''
                    }],
                    '1':[{
                        itemname:'水晶',
                        itemattr:'1-shui',
                        itemvalue:''
                    },{
                        itemname:'燃气',
                        itemattr:'1-ran',
                        itemvalue:''
                    },{
                        itemname:'人口',
                        itemattr:'1-penple',
                        itemvalue:''
                    }],
                },
                clicked:false,
                username: '',
                password: '',
                value1: 0,
                option1: [
                    {text: '钢、木等结构的安全验算', value: 0},
                    {text: '钢筋混凝土配筋验算', value: 1},
                    {text: '边坡、支护、挡土墙快速算法', value: 2},
                    {text: '连续梁快速算法', value: 3},
                    {text: '柱与支撑的屈服算法', value: 4},
                    {text: '楼板内力快速算法', value: 5},
                    {text: '平面框架和桁架的内力计算', value: 6},
                    {text: '测量、大地坐标', value: 7},
                    {text: '电工的常用算法', value: 8},
                    {text: '水暖的常用算法', value: 9},
                ],

            };
        },
        mounted() {
            this.calculatePath();
        },
        methods: {
            onSubmit(values) {
                console.log('submit', values);
                this.clicked=true
            },
            getScales() {
                const x = d3.scaleTime().range([0, 430]);
                const y = d3.scaleLinear().range([210, 0]);
                d3.axisLeft().scale(x);
                d3.axisBottom().scale(y);
                x.domain(d3.extent(this.data, (d, i) => i));
                y.domain([0, d3.max(this.data, d => d)]);
                return { x, y };
            },
            sethang(svg,hang,zong) {
                for (var i=0;i<hang;i++) {
                    svg.append('line')
                        .style("stroke", "black")
                        .attr("x1", 100*i)
                        .attr("y1", 0)
                        .attr("x2", 100*i)
                        .attr("y2", 100*(zong-1));
                }
            },
            setzong(svg,hang,zong) {
                for (var i=0;i<zong;i++) {
                    svg.append('line')
                        .style("stroke", "black")
                        .attr("x1", 0)
                        .attr("y1", 100*i)
                        .attr("x2", 100*(hang-1))
                        .attr("y2", 100*i);
                }
            },
            setjiaodian(svg,hang,zong) {
                var hangarr=[]
                var zongarr=[]
                for (var i=0;i<hang;i++) {
                    hangarr.push(i*100)
                }
                for (var k=0;k<zong;k++) {
                    zongarr.push(k*100)
                }
                for (var a=0;a<hangarr.length;a++) {
                    for (var j=0;j<zongarr.length;j++) {
                        svg.append('text')
                            .attr('x', hangarr[a])
                            .attr('y', zongarr[j])
                            .attr('dy', '1em')
                            .text('A'+a+j)
                    }
                }

                console.log(hangarr, zongarr);
            },

            calculatePath() {
                var width = 700, height = 700;

                var svg = d3.select("#zuobiao")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("transform", "translate(50, 50)")

                this.sethang(svg,6,6)
                this.setzong(svg,6,6)
                this.setjiaodian(svg,6,6)


            },


        },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
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
