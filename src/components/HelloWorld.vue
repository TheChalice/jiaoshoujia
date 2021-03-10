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
                            :name=item.itemattr
                            :label=item.itemname
                            :placeholder=item.itemname
                />
            </div>

            <div style="margin: 16px;">
                <van-button v-show="!clicked" round block type="info" native-type="submit">计算</van-button>
<!--                <van-button v-show="clicked" loading round block  type="info" loading-text="计算中..." />-->


            </div>
            <van-row>
                <van-col span="24">
                    <div id="zuobiao">
                    </div>
                </van-col>
            </van-row>

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
                        itemattr:'0-heng',
                        itemlabel:'heng',
                        itemvalue:'2'
                    },{
                        itemname:'纵格',
                        itemattr:'0-zong',
                        itemlabel:'zong',
                        itemvalue:'3'
                    },{
                        itemname:'跨度',
                        itemattr:'0-kuadu',
                        itemlabel:'kuadu',
                        itemvalue:'288'
                    },{
                        itemname:'层高',
                        itemattr:'0-cenggao',
                        itemlabel:'cenggao',
                        itemvalue:'144'
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
            // this.calculatePath();
        },
        methods: {
            onSubmit(values) {
                console.log('submit', values);
                // this.clicked=true
                this.calculatePath(values['0-heng'],values['0-zong'],values['0-kuadu'],values['0-cenggao'])
            },
            setzong(svg,hang,zong,hc,zg) {
                for (var i=0;i<hang;i++) {
                    svg.append('line')
                        .style("stroke", "#b021ad")
                        .style("stroke-width", 3)
                        .attr("x1", hc*i)
                        .attr("y1", 0)
                        .attr("x2", hc*i)
                        .attr("y2", zg*(zong-1));
                }
            },
            sethang(svg,hang,zong,hc,zg) {
                for (var i=0;i<zong;i++) {
                    if (i == zong - 1) {
                        svg.append('line')
                            .style("stroke", "black")
                            .style("stroke-width", 4)
                            .attr("x1", 0)
                            .attr("y1", zg*i)
                            .attr("x2", hc*(hang-1))
                            .attr("y2", zg*i);
                    }else {
                        svg.append('line')
                            .style("stroke", "#b021ad")
                            .style("stroke-width", 3)
                            .attr("x1", 0)
                            .attr("y1", zg*i)
                            .attr("x2", hc*(hang-1))
                            .attr("y2", zg*i);
                    }

                }
            },
            setjiaodian(svg,hang,zong,hc,zg) {
                var hangarr=[]
                var zongarr=[]
                for (var i=0;i<hang;i++) {
                    hangarr.push(i*hc)
                }
                for (var k=0;k<zong;k++) {
                    zongarr.push(k*zg)
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
            },
            drawfang(svg,hang,zong,hc,zg){
                this.sethang(svg,hang,zong,hc,zg)
                this.setzong(svg,hang,zong,hc,zg)
                this.setjiaodian(svg,hang,zong,hc,zg)
            },
            calculatePath(hang,zong,hc,zg) {
                d3.selectAll("svg").remove();
                var width = '100%', height = 700;
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
                var container=svg.append("g")
                    .attr('transform', "translate(10, 10)")
                this.drawfang(container,hang,zong,hc,zg)
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
