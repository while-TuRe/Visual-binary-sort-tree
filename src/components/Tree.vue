
<template>
    <div class="parentNode">
        <svg class="chart">

        </svg>
    </div>
</template>

<script>
    import globalData from '../global.js' 
    import * as d3 from "d3"
    function drawTree(selected){
        var data = globalData.data
        // console.log('——————input data——————');
        // console.log(d3.select('.chart').exit());

        const svg = d3.select('.chart')
            .attr('width', globalData.width)
            .attr('height', globalData.height);
        svg.selectAll('g').remove()

        const g = svg.append('g').attr('transform', 'translate(0, 20)');

        //将数据结构化, 返回后的node节点及其后代均有如下属性
        //node.data, node.depth, node.height, node.parent, node.children, node.value
        const hierarchyData = d3.hierarchy(data);
        // console.log("——————d3.hierarchy(data)——————");
        // console.log(hierarchyData);

        //d3.tree()返回tree layout,后续链式写法对layout进行配置
        const treeLayout = d3.tree()
            .size([globalData.width, globalData.height - 30])
            .separation((a, b) => {
                return a.parent === b.parent ? 1 : 2;
            });
        // console.log("——————treeLayout——————");
        // console.log(treeLayout);

        //将数据扔进layout,获取更易于布局的数据nodesData, 相对hierarchyData, 所有数据加上了.x,.y属性
        const nodesData = treeLayout(hierarchyData);
        // console.log("——————nodesData——————");
        // console.log(nodesData);

        //console.log("-----------delete {}---------------")
        /**删除name值为null的节点 
         * Node:{
         *  children:[Array]->{data{name children[]}}
         *  data:{
         *      name,
         *      children[Array]->{name children}
         *  }
         * }
        */
        var queue = [nodesData]
        while(queue.length){
            var node = queue.shift()//删除第一位并返回
            //console.log(node,node.data.children!=undefined)
            if(node.data.children!=undefined){//对象不为空
                for(var i=1;i>=0;i--){//从后往前检查children
                    //console.log("for:",node.children[i].data.children==undefined)

                    if(node.children[i].data.children==undefined){
                        node.children.splice(i,1)//从i开始删除1个
                    }else{
                        queue.push(node.children[i])
                    }
                }
            }
        }

        // console.log("——————节点展开，由于是画link，所以去除root节点");
        // console.log(nodesData.descendants().slice(1));
        const links = g.selectAll('.links')
            .data(nodesData.descendants().slice(1))
            .enter().append('path')
            .attr('fill', 'none')
            .attr('stroke', '#313131')
            .attr('stroke-width', 2)
            .attr('d', (d) => {
                return `
                M${d.x},${d.y}
                C${d.x},${(d.y + d.parent.y) / 2}
                ${d.parent.x},${(d.y + d.parent.y) / 2.5}
                ${d.parent.x},${d.parent.y}`;
            });

        const nodes = g.selectAll('.node')
            .data(nodesData.descendants())
            .enter().append('g')
            .attr('transform', (d) => {
                return `translate(${d.x}, ${d.y})`;
            });

        //画圆 
        nodes.append('circle')
            .style('fill', (d) =>{
                //console.log(d.data.name,selected,d.data.name == selected)
                return d.data.name == selected ?'#ff0000' :'#53a9f0'
                })//d是node，()=>{} 相当于 function(){}
            .attr('r', 10);

        //插入文字
        nodes.append('text')
            .attr('dx', '.9em')
            .text((d) => {
                return d.data.name;
            });
        console.log(selected,"DrawTree Down")
    }
    /**在循环中使用setTime会因为变量i的改变引发问题，故封装起来使每个i都有自己单独的作用域*/
    // function mySetTimeout(f,param,time)
    // {  
    //     setTimeout(function(){f(param);},time);  
    // }  
    function TdrawTree(selected,time){
        setTimeout(function(){drawTree(selected)},time);
    }
    // function test(str){ 
    // alert(str)
    // } 
    // let a=[10,11,12]
    // for(var i=0;i<3;i++){
    //     mySetTimeout(test,a,1000*i)

    // }
    export default {
        name: 'Tree',
        methods:{
            updateTree:function(selected=null,time=0){
                TdrawTree(selected,time)
            },
            showPath:function(path){
                //console.log("path in tree",path)
                for(var i=0;i<path.length;i++){
                    //drawTree(path[i])
                //console.log("path in tree",path[i],i)
                    //mySetTimeout(drawTree,path[i].name,1000*i)
                    TdrawTree(path[i].name,i*globalData.baseTime)
                    //setTimeout(function(){drawTree(path[i])}, 2000*i)
                    //setTimeout ("drawTree('+path[i]+')","2000");
                }
            }
        },
    }

</script>
